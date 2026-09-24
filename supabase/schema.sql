-- ==============================================================================
-- Asset Management System — Supabase Database Schema
-- Run this in your Supabase SQL Editor to setup tables & sample seed data.
-- ==============================================================================

-- 1. DEPARTMENTS
create table if not exists public.departments (
  id text primary key,
  name text not null,
  code text,
  head text,
  location_id text,
  headcount integer default 0,
  asset_count integer default 0,
  badge_bg text,
  created_at timestamp with time zone default now()
);

-- 2. CATEGORIES
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text,
  color text,
  asset_count integer default 0,
  description text,
  depreciation_method text,
  useful_life_years integer,
  requires_calibration boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. LOCATIONS
create table if not exists public.locations (
  id text primary key,
  name text not null,
  address text,
  type text,
  country text,
  city text,
  asset_count integer default 0,
  employee_count integer default 0,
  created_at timestamp with time zone default now()
);

-- 4. EMPLOYEES
create table if not exists public.employees (
  id text primary key,
  name text not null,
  role text,
  department text,
  department_id text references public.departments(id) on delete set null,
  location text,
  location_id text references public.locations(id) on delete set null,
  email text unique not null,
  joined_date text,
  avatar_bg text,
  created_at timestamp with time zone default now()
);

-- 5. ASSETS
create table if not exists public.assets (
  id text primary key,
  name text not null,
  code text not null,
  category text,
  category_id text references public.categories(id) on delete set null,
  serial text,
  department text,
  department_id text references public.departments(id) on delete set null,
  location text,
  location_id text references public.locations(id) on delete set null,
  assigned_to text,
  warranty_expiry text,
  status text not null default 'Available',
  created_at timestamp with time zone default now()
);

-- 6. WORK ORDERS (MAINTENANCE)
create table if not exists public.work_orders (
  id text primary key,
  asset_id text references public.assets(id) on delete set null,
  asset_name text,
  asset_code text,
  type text not null,
  date text not null,
  technician_id text,
  technician_name text,
  technician_avatar text,
  technician_avatar_color text,
  cost_usd numeric default 0,
  status text not null default 'Scheduled',
  created_at timestamp with time zone default now()
);

-- 7. ASSET ASSIGNMENTS
create table if not exists public.asset_assignments (
  id uuid primary key default gen_random_uuid(),
  asset_id text references public.assets(id) on delete cascade,
  employee_id text references public.employees(id) on delete cascade,
  assigned_date text not null,
  return_date text,
  notes text,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security) and allow public read/write for demo purposes
alter table public.departments enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.employees enable row level security;
alter table public.assets enable row level security;
alter table public.work_orders enable row level security;
alter table public.asset_assignments enable row level security;

create policy "Allow public access to departments" on public.departments for all using (true) with check (true);
create policy "Allow public access to categories" on public.categories for all using (true) with check (true);
create policy "Allow public access to locations" on public.locations for all using (true) with check (true);
create policy "Allow public access to employees" on public.employees for all using (true) with check (true);
create policy "Allow public access to assets" on public.assets for all using (true) with check (true);
create policy "Allow public access to work_orders" on public.work_orders for all using (true) with check (true);
create policy "Allow public access to asset_assignments" on public.asset_assignments for all using (true) with check (true);

-- Seed Initial Data
insert into public.departments (id, name, code, head, headcount, asset_count, badge_bg) values
  ('DEP-001', 'Engineering', 'EN', 'Priya Sharma', 48, 132, 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)'),
  ('DEP-002', 'Design', 'DE', 'Marcus Chen', 12, 34, 'linear-gradient(135deg, #0D9488 0%, #0284C7 100%)'),
  ('DEP-003', 'Operations', 'OP', 'Sofia Alvarez', 22, 78, 'linear-gradient(135deg, #B45309 0%, #78350F 100%)'),
  ('DEP-004', 'Production', 'PR', 'Kenji Tanaka', 64, 210, 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'),
  ('DEP-005', 'Quality', 'QU', 'Amelia Wright', 14, 41, 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)'),
  ('DEP-006', 'Maintenance', 'MA', 'David Okafor', 18, 62, 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)')
on conflict (id) do nothing;

insert into public.categories (id, name, icon, color, asset_count, description) values
  ('CAT-001', 'Laptops', 'laptop', '#EEF2FF', 184, 'Portable workstation computers, notebooks, and ultrabooks.'),
  ('CAT-002', 'Monitors', 'monitor', '#E0F2FE', 142, 'External display panels, 4K monitors, and desktop screens.'),
  ('CAT-003', 'Machines', 'machine', '#DCFCE7', 68, 'Industrial production machinery, presses, and automated tools.'),
  ('CAT-004', 'Molds', 'mold', '#FEF3C7', 42, 'Custom injection molds, casting dyes, and tooling fixtures.'),
  ('CAT-005', 'Forklifts', 'forklift', '#FEE2E2', 18, 'Warehouse material handling forklifts, stackers, and pallet trucks.')
on conflict (id) do nothing;

insert into public.locations (id, name, address, type, asset_count, employee_count) values
  ('LOC-001', 'HQ — Bengaluru', 'Whitefield, Bengaluru, IN', 'Headquarters', 214, 92),
  ('LOC-002', 'Plant 1 — Pune', 'Chakan MIDC, Pune, IN', 'Manufacturing', 486, 138),
  ('LOC-003', 'Warehouse A', 'Bhiwandi, MH, IN', 'Warehouse', 128, 24),
  ('LOC-004', 'R&D Lab', 'Whitefield, Bengaluru, IN', 'Research', 74, 18)
on conflict (id) do nothing;

insert into public.employees (id, name, role, department, location, email, joined_date, avatar_bg) values
  ('EMP-001', 'Priya Sharma', 'Engineering Lead', 'Engineering', 'HQ — Bengaluru', 'priya@atlas.co', '2022-03-14', '#2563EB'),
  ('EMP-002', 'Marcus Chen', 'Design Director', 'Design', 'HQ — Bengaluru', 'marcus@atlas.co', '2021-08-10', '#0284C7'),
  ('EMP-003', 'Sofia Alvarez', 'Ops Manager', 'Operations', 'Warehouse A', 'sofia@atlas.co', '2023-01-15', '#EA580C'),
  ('EMP-004', 'Kenji Tanaka', 'Production Head', 'Production', 'Plant 1 — Pune', 'kenji@atlas.co', '2020-11-05', '#2563EB'),
  ('EMP-005', 'Amelia Wright', 'QA Manager', 'Quality', 'HQ — Bengaluru', 'amelia@atlas.co', '2022-06-20', '#65A30D'),
  ('EMP-006', 'David Okafor', 'Maintenance Lead', 'Maintenance', 'Plant 1 — Pune', 'david@atlas.co', '2019-04-12', '#0284C7')
on conflict (id) do nothing;

insert into public.assets (id, name, code, category, serial, department, location, assigned_to, warranty_expiry, status) values
  ('AST-00184', 'MacBook Pro 16" M3', 'AST-00184', 'Laptops', 'C02XL0GJHV29', 'Engineering', 'HQ — Bengaluru', 'Priya Sharma', '2027-02-11', 'In Use'),
  ('AST-00203', 'Dell UltraSharp U2723QE', 'AST-00203', 'Monitors', 'CN0DL8JX', 'Engineering', 'HQ — Bengaluru', 'Priya Sharma', '2027-03-04', 'In Use'),
  ('AST-00512', 'Haitian MA1200 Press', 'AST-00512', 'Machines', 'HT-2211-8814', 'Production', 'Plant 1 — Pune', null, '2025-06-18', 'Maintenance'),
  ('AST-00618', 'Mold — Housing v3', 'AST-00618', 'Molds', 'MOLD-618', 'Production', 'Plant 1 — Pune', 'Kenji Tanaka', '2028-11-02', 'In Use'),
  ('AST-00701', 'Toyota 8FGU25 Forklift', 'AST-00701', 'Forklifts', 'TY-8FGU25-901', 'Operations', 'Warehouse A', 'Rahul Verma', '2024-04-22', 'In Use')
on conflict (id) do nothing;
