-- =====================================================================
-- Asset Management – revised schema (PostgreSQL / Supabase)
-- =====================================================================
-- WARNING: the DROP block below deletes existing tables and data.
-- Run 01_schema.sql first, then 02_seed.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Clean slate
-- ---------------------------------------------------------------------
DROP VIEW  IF EXISTS public.v_asset_timeline CASCADE;
DROP VIEW  IF EXISTS public.v_work_orders    CASCADE;
DROP VIEW  IF EXISTS public.v_assets         CASCADE;
DROP VIEW  IF EXISTS public.v_employees      CASCADE;
DROP VIEW  IF EXISTS public.v_departments    CASCADE;

DROP TABLE IF EXISTS public.asset_history     CASCADE;
DROP TABLE IF EXISTS public.asset_assignments CASCADE;
DROP TABLE IF EXISTS public.work_orders       CASCADE;
DROP TABLE IF EXISTS public.assets            CASCADE;
DROP TABLE IF EXISTS public.employees         CASCADE;
DROP TABLE IF EXISTS public.departments       CASCADE;
DROP TABLE IF EXISTS public.categories        CASCADE;
DROP TABLE IF EXISTS public.locations         CASCADE;

-- ---------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------
CREATE TABLE public.locations (
  id              text PRIMARY KEY,
  name            text NOT NULL,
  address         text,
  type            text,
  country         text,
  city            text,
  asset_count     integer NOT NULL DEFAULT 0,   -- maintained by triggers
  employee_count  integer NOT NULL DEFAULT 0,   -- maintained by triggers
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id                    text PRIMARY KEY,
  name                  text NOT NULL UNIQUE,
  icon                  text,
  color                 text,
  asset_count           integer NOT NULL DEFAULT 0,   -- maintained by triggers
  description           text,
  depreciation_method   text CHECK (depreciation_method IN ('Straight Line', 'Declining Balance')),
  useful_life_years     integer CHECK (useful_life_years > 0),
  requires_calibration  boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- departments.head_id -> employees is added after employees exists
-- (departments and employees reference each other).
CREATE TABLE public.departments (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  code         text NOT NULL UNIQUE,
  head_id      text NOT NULL,
  location_id  text NOT NULL REFERENCES public.locations(id),
  headcount    integer NOT NULL DEFAULT 0,          -- maintained by triggers
  asset_count  integer NOT NULL DEFAULT 0,          -- maintained by triggers
  badge_bg     text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.employees (
  id             text PRIMARY KEY,
  name           text NOT NULL,
  role           text,
  department_id  text NOT NULL REFERENCES public.departments(id),
  location_id    text NOT NULL REFERENCES public.locations(id),
  email          text NOT NULL UNIQUE,
  joined_date    date,
  avatar_bg      text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Circular reference: checked at COMMIT, so both sides can be inserted
-- inside one transaction.
ALTER TABLE public.departments
  ADD CONSTRAINT departments_head_id_fkey
  FOREIGN KEY (head_id) REFERENCES public.employees(id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE public.assets (
  id               text PRIMARY KEY,
  name             text NOT NULL,
  code             text NOT NULL UNIQUE,
  serial           text UNIQUE,
  category_id      text NOT NULL REFERENCES public.categories(id),
  department_id    text NOT NULL REFERENCES public.departments(id),
  location_id      text NOT NULL REFERENCES public.locations(id),
  warranty_expiry  date,
  status           text NOT NULL DEFAULT 'Available'
                   CHECK (status IN ('Available', 'Assigned', 'In Maintenance', 'Retired', 'Lost')),
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.work_orders (
  id             text PRIMARY KEY,
  asset_id       text NOT NULL REFERENCES public.assets(id),
  type           text NOT NULL
                 CHECK (type IN ('Preventive Maintenance', 'Corrective Repair', 'Calibration', 'Inspection')),
  date           date NOT NULL,
  technician_id  text NOT NULL REFERENCES public.employees(id),
  cost_usd       numeric(12,2) NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
  status         text NOT NULL DEFAULT 'Scheduled'
                 CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.asset_assignments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id       text NOT NULL REFERENCES public.assets(id),
  employee_id    text NOT NULL REFERENCES public.employees(id),
  assigned_date  date NOT NULL,
  return_date    date,
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (return_date IS NULL OR return_date >= assigned_date)
);

-- An asset can only have ONE open (not yet returned) assignment.
CREATE UNIQUE INDEX one_open_assignment_per_asset
  ON public.asset_assignments (asset_id) WHERE return_date IS NULL;

-- NEW: timeline / audit trail for every asset
CREATE TABLE public.asset_history (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id       text NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  event_type     text NOT NULL CHECK (event_type IN (
                   'Created', 'Assigned', 'Returned', 'Transferred',
                   'Maintenance Scheduled', 'Maintenance Started',
                   'Maintenance Completed', 'Maintenance Cancelled',
                   'Retired', 'Lost', 'Status Changed')),
  event_date     timestamptz NOT NULL DEFAULT now(),
  -- Optional context links. These are nullable on purpose: a "Created"
  -- event has no employee, only assignment events have an assignment, etc.
  -- The CHECKs below force them to be filled whenever the event needs them.
  employee_id    text REFERENCES public.employees(id),
  assignment_id  uuid REFERENCES public.asset_assignments(id),
  work_order_id  text REFERENCES public.work_orders(id),
  description    text NOT NULL,
  details        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (event_type NOT IN ('Assigned', 'Returned')
         OR (employee_id IS NOT NULL AND assignment_id IS NOT NULL)),
  CHECK (event_type NOT LIKE 'Maintenance%' OR work_order_id IS NOT NULL)
);

-- ---------------------------------------------------------------------
-- 2. Indexes on foreign keys
-- ---------------------------------------------------------------------
CREATE INDEX idx_departments_location   ON public.departments (location_id);
CREATE INDEX idx_departments_head       ON public.departments (head_id);
CREATE INDEX idx_employees_department   ON public.employees (department_id);
CREATE INDEX idx_employees_location     ON public.employees (location_id);
CREATE INDEX idx_assets_category        ON public.assets (category_id);
CREATE INDEX idx_assets_department      ON public.assets (department_id);
CREATE INDEX idx_assets_location        ON public.assets (location_id);
CREATE INDEX idx_assets_status          ON public.assets (status);
CREATE INDEX idx_work_orders_asset      ON public.work_orders (asset_id);
CREATE INDEX idx_work_orders_technician ON public.work_orders (technician_id);
CREATE INDEX idx_assignments_asset      ON public.asset_assignments (asset_id);
CREATE INDEX idx_assignments_employee   ON public.asset_assignments (employee_id);
CREATE INDEX idx_history_asset_date     ON public.asset_history (asset_id, event_date DESC);
CREATE INDEX idx_history_employee       ON public.asset_history (employee_id);

-- ---------------------------------------------------------------------
-- 3. Real counts (asset_count, headcount, employee_count)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recount_asset_refs(
  p_category text, p_department text, p_location text
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.categories c
     SET asset_count = (SELECT count(*) FROM public.assets a WHERE a.category_id = c.id)
   WHERE c.id = p_category;

  UPDATE public.departments d
     SET asset_count = (SELECT count(*) FROM public.assets a WHERE a.department_id = d.id)
   WHERE d.id = p_department;

  UPDATE public.locations l
     SET asset_count = (SELECT count(*) FROM public.assets a WHERE a.location_id = l.id)
   WHERE l.id = p_location;
END $$;

CREATE OR REPLACE FUNCTION public.recount_employee_refs(
  p_department text, p_location text
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.departments d
     SET headcount = (SELECT count(*) FROM public.employees e WHERE e.department_id = d.id)
   WHERE d.id = p_department;

  UPDATE public.locations l
     SET employee_count = (SELECT count(*) FROM public.employees e WHERE e.location_id = l.id)
   WHERE l.id = p_location;
END $$;

CREATE OR REPLACE FUNCTION public.trg_assets_recount() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    PERFORM public.recount_asset_refs(OLD.category_id, OLD.department_id, OLD.location_id);
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM public.recount_asset_refs(NEW.category_id, NEW.department_id, NEW.location_id);
  END IF;
  RETURN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.trg_employees_recount() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    PERFORM public.recount_employee_refs(OLD.department_id, OLD.location_id);
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM public.recount_employee_refs(NEW.department_id, NEW.location_id);
  END IF;
  RETURN NULL;
END $$;

CREATE TRIGGER assets_recount
  AFTER INSERT OR DELETE OR UPDATE OF category_id, department_id, location_id
  ON public.assets FOR EACH ROW EXECUTE FUNCTION public.trg_assets_recount();

CREATE TRIGGER employees_recount
  AFTER INSERT OR DELETE OR UPDATE OF department_id, location_id
  ON public.employees FOR EACH ROW EXECUTE FUNCTION public.trg_employees_recount();

-- Manual full recount (safety net / after bulk imports)
CREATE OR REPLACE FUNCTION public.refresh_all_counts() RETURNS void LANGUAGE sql AS $$
  UPDATE public.categories c
     SET asset_count = (SELECT count(*) FROM public.assets a WHERE a.category_id = c.id);
  UPDATE public.departments d
     SET asset_count = (SELECT count(*) FROM public.assets a WHERE a.department_id = d.id),
         headcount   = (SELECT count(*) FROM public.employees e WHERE e.department_id = d.id);
  UPDATE public.locations l
     SET asset_count    = (SELECT count(*) FROM public.assets a WHERE a.location_id = l.id),
         employee_count = (SELECT count(*) FROM public.employees e WHERE e.location_id = l.id);
$$;

-- ---------------------------------------------------------------------
-- 4. Asset status is derived from assignments + work orders
--    Retired / Lost are manual and never overwritten.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.refresh_asset_status(p_asset_id text)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_new text;
BEGIN
  SELECT CASE
           WHEN a.status IN ('Retired', 'Lost') THEN a.status
           WHEN EXISTS (SELECT 1 FROM public.work_orders w
                         WHERE w.asset_id = a.id AND w.status = 'In Progress') THEN 'In Maintenance'
           WHEN EXISTS (SELECT 1 FROM public.asset_assignments s
                         WHERE s.asset_id = a.id AND s.return_date IS NULL)     THEN 'Assigned'
           ELSE 'Available'
         END
    INTO v_new
    FROM public.assets a
   WHERE a.id = p_asset_id;

  UPDATE public.assets
     SET status = v_new
   WHERE id = p_asset_id AND status IS DISTINCT FROM v_new;
END $$;

-- ---------------------------------------------------------------------
-- 5. History triggers (this is what fills asset_history automatically)
-- ---------------------------------------------------------------------

-- 5a. Asset added
CREATE OR REPLACE FUNCTION public.trg_assets_history_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.asset_history (asset_id, event_type, event_date, description, details)
  VALUES (NEW.id, 'Created', NEW.created_at,
          format('Asset %s (%s) added to inventory', NEW.name, NEW.code),
          jsonb_build_object('category_id', NEW.category_id,
                             'department_id', NEW.department_id,
                             'location_id', NEW.location_id));
  RETURN NULL;
END $$;

CREATE TRIGGER assets_history_insert
  AFTER INSERT ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.trg_assets_history_insert();

-- 5b. Asset moved to another department / location, retired, lost, restored
CREATE OR REPLACE FUNCTION public.trg_assets_history_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.location_id IS DISTINCT FROM OLD.location_id
     OR NEW.department_id IS DISTINCT FROM OLD.department_id THEN
    INSERT INTO public.asset_history (asset_id, event_type, description, details)
    VALUES (NEW.id, 'Transferred',
            format('Transferred from %s / %s to %s / %s',
                   (SELECT name FROM public.locations   WHERE id = OLD.location_id),
                   (SELECT name FROM public.departments WHERE id = OLD.department_id),
                   (SELECT name FROM public.locations   WHERE id = NEW.location_id),
                   (SELECT name FROM public.departments WHERE id = NEW.department_id)),
            jsonb_build_object('from_location_id',   OLD.location_id,
                               'to_location_id',     NEW.location_id,
                               'from_department_id', OLD.department_id,
                               'to_department_id',   NEW.department_id));
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status IN ('Retired', 'Lost') THEN
      INSERT INTO public.asset_history (asset_id, event_type, description, details)
      VALUES (NEW.id, NEW.status,
              format('Asset marked as %s', NEW.status),
              jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
    ELSIF OLD.status IN ('Retired', 'Lost') THEN
      INSERT INTO public.asset_history (asset_id, event_type, description, details)
      VALUES (NEW.id, 'Status Changed',
              format('Asset restored to service (was %s)', OLD.status),
              jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
    END IF;
  END IF;
  RETURN NULL;
END $$;

CREATE TRIGGER assets_history_update
  AFTER UPDATE OF location_id, department_id, status ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.trg_assets_history_update();

-- 5c. Assigned / Returned
CREATE OR REPLACE FUNCTION public.trg_assignments_history() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_emp text;
BEGIN
  SELECT name INTO v_emp FROM public.employees WHERE id = NEW.employee_id;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.asset_history
      (asset_id, event_type, event_date, employee_id, assignment_id, description, details)
    VALUES (NEW.asset_id, 'Assigned', (NEW.assigned_date + time '09:00')::timestamptz,
            NEW.employee_id, NEW.id,
            format('Assigned to %s', v_emp),
            jsonb_build_object('notes', NEW.notes));

    IF NEW.return_date IS NOT NULL THEN
      INSERT INTO public.asset_history
        (asset_id, event_type, event_date, employee_id, assignment_id, description, details)
      VALUES (NEW.asset_id, 'Returned', (NEW.return_date + time '17:00')::timestamptz,
              NEW.employee_id, NEW.id,
              format('Returned by %s', v_emp),
              jsonb_build_object('notes', NEW.notes));
    END IF;

  ELSIF TG_OP = 'UPDATE' AND OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
    INSERT INTO public.asset_history
      (asset_id, event_type, event_date, employee_id, assignment_id, description, details)
    VALUES (NEW.asset_id, 'Returned', (NEW.return_date + time '17:00')::timestamptz,
            NEW.employee_id, NEW.id,
            format('Returned by %s', v_emp),
            jsonb_build_object('notes', NEW.notes));
  END IF;

  PERFORM public.refresh_asset_status(NEW.asset_id);
  RETURN NULL;
END $$;

CREATE TRIGGER assignments_history
  AFTER INSERT OR UPDATE OF return_date ON public.asset_assignments
  FOR EACH ROW EXECUTE FUNCTION public.trg_assignments_history();

-- 5d. Maintenance work orders
CREATE OR REPLACE FUNCTION public.trg_work_orders_history() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_evt  text;
  v_verb text;
  v_ts   timestamptz;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.asset_history
      (asset_id, event_type, event_date, employee_id, work_order_id, description, details)
    VALUES (NEW.asset_id, 'Maintenance Scheduled', NEW.created_at,
            NEW.technician_id, NEW.id,
            format('%s work order %s created for %s', NEW.type, NEW.id, NEW.date),
            jsonb_build_object('type', NEW.type, 'scheduled_for', NEW.date));
    v_ts := (NEW.date + time '10:00')::timestamptz;
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    v_ts := now();
  ELSE
    RETURN NULL;
  END IF;

  v_evt := CASE NEW.status
             WHEN 'In Progress' THEN 'Maintenance Started'
             WHEN 'Completed'   THEN 'Maintenance Completed'
             WHEN 'Cancelled'   THEN 'Maintenance Cancelled'
           END;
  v_verb := CASE NEW.status
              WHEN 'In Progress' THEN 'started'
              WHEN 'Completed'   THEN 'completed'
              WHEN 'Cancelled'   THEN 'cancelled'
            END;

  IF v_evt IS NOT NULL THEN
    INSERT INTO public.asset_history
      (asset_id, event_type, event_date, employee_id, work_order_id, description, details)
    VALUES (NEW.asset_id, v_evt, v_ts, NEW.technician_id, NEW.id,
            format('%s work order %s %s', NEW.type, NEW.id, v_verb),
            jsonb_build_object('type', NEW.type, 'cost_usd', NEW.cost_usd));
  END IF;

  PERFORM public.refresh_asset_status(NEW.asset_id);
  RETURN NULL;
END $$;

CREATE TRIGGER work_orders_history
  AFTER INSERT OR UPDATE OF status ON public.work_orders
  FOR EACH ROW EXECUTE FUNCTION public.trg_work_orders_history();

-- ---------------------------------------------------------------------
-- 6. Views: same "flat" columns your UI used before (names instead of ids)
-- ---------------------------------------------------------------------
CREATE VIEW public.v_departments WITH (security_invoker = true) AS
SELECT d.id, d.name, d.code, d.headcount, d.asset_count, d.badge_bg, d.created_at,
       d.head_id,     h.name AS head,
       d.location_id, l.name AS location
  FROM public.departments d
  JOIN public.employees h ON h.id = d.head_id
  JOIN public.locations l ON l.id = d.location_id;

CREATE VIEW public.v_employees WITH (security_invoker = true) AS
SELECT e.id, e.name, e.role, e.email, e.joined_date, e.avatar_bg, e.created_at,
       e.department_id, d.name AS department,
       e.location_id,   l.name AS location
  FROM public.employees e
  JOIN public.departments d ON d.id = e.department_id
  JOIN public.locations   l ON l.id = e.location_id;

CREATE VIEW public.v_assets WITH (security_invoker = true) AS
SELECT a.id, a.name, a.code, a.serial, a.status, a.warranty_expiry, a.created_at,
       a.category_id,   c.name AS category,
       a.department_id, d.name AS department,
       a.location_id,   l.name AS location,
       s.employee_id AS assigned_to_id,
       e.name        AS assigned_to
  FROM public.assets a
  JOIN public.categories  c ON c.id = a.category_id
  JOIN public.departments d ON d.id = a.department_id
  JOIN public.locations   l ON l.id = a.location_id
  LEFT JOIN public.asset_assignments s ON s.asset_id = a.id AND s.return_date IS NULL
  LEFT JOIN public.employees e ON e.id = s.employee_id;

CREATE VIEW public.v_work_orders WITH (security_invoker = true) AS
SELECT w.id, w.asset_id, a.name AS asset_name, a.code AS asset_code,
       w.type, w.date, w.status, w.cost_usd, w.notes, w.created_at,
       w.technician_id,
       t.name AS technician_name,
       upper(left(t.name, 1) || left(split_part(t.name, ' ', 2), 1)) AS technician_avatar,
       t.avatar_bg AS technician_avatar_color
  FROM public.work_orders w
  JOIN public.assets    a ON a.id = w.asset_id
  JOIN public.employees t ON t.id = w.technician_id;

CREATE VIEW public.v_asset_timeline WITH (security_invoker = true) AS
SELECT h.id, h.asset_id, a.code AS asset_code, a.name AS asset_name,
       h.event_type, h.event_date, h.description, h.details,
       h.employee_id, e.name AS employee_name,
       h.assignment_id, h.work_order_id
  FROM public.asset_history h
  JOIN public.assets a ON a.id = h.asset_id
  LEFT JOIN public.employees e ON e.id = h.employee_id;

-- Usage:
--   SELECT * FROM public.v_asset_timeline WHERE asset_id = 'AST-004' ORDER BY event_date;
