-- =====================================================================
-- Seed data (run AFTER 01_schema.sql)
-- Do NOT insert asset_count / headcount / employee_count or asset_history
-- rows by hand – triggers create them from the inserts below.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- Locations
-- ---------------------------------------------------------------------
INSERT INTO public.locations (id, name, address, type, country, city) VALUES
('LOC-01', 'Pune Head Office',        'Tower B, Hinjewadi Phase 2, Pune 411057',          'Head Office',        'India',     'Pune'),
('LOC-02', 'Bengaluru Tech Park',     'ITPL Main Road, Whitefield, Bengaluru 560066',     'Development Center', 'India',     'Bengaluru'),
('LOC-03', 'Mumbai Regional Office',  'Bandra Kurla Complex, Mumbai 400051',              'Regional Office',    'India',     'Mumbai'),
('LOC-04', 'Singapore Sales Office',  '1 Raffles Place, Singapore 048616',                'Sales Office',       'Singapore', 'Singapore');

-- ---------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------
INSERT INTO public.categories
  (id, name, icon, color, description, depreciation_method, useful_life_years, requires_calibration) VALUES
('CAT-LAP', 'Laptops',                        'laptop',     '#3B82F6', 'Company-issued laptops and notebooks',            'Straight Line',     4,  false),
('CAT-DSK', 'Desktops',                       'cpu',        '#6366F1', 'Desktop workstations',                            'Straight Line',     5,  false),
('CAT-MON', 'Monitors',                       'monitor',    '#8B5CF6', 'External displays',                               'Straight Line',     5,  false),
('CAT-MOB', 'Mobile Devices',                 'smartphone', '#EC4899', 'Phones and tablets',                              'Straight Line',     3,  false),
('CAT-NET', 'Networking Equipment',           'network',    '#10B981', 'Switches, access points and firewalls',           'Declining Balance', 5,  false),
('CAT-FUR', 'Office Furniture',               'armchair',   '#F59E0B', 'Chairs, desks and storage',                       'Straight Line',     10, false),
('CAT-INS', 'Test & Measurement Instruments', 'gauge',      '#EF4444', 'Multimeters, oscilloscopes, power supplies',      'Declining Balance', 8,  true),
('CAT-PRN', 'Printers',                       'printer',    '#64748B', 'Shared printers and copiers',                     'Straight Line',     5,  false);

-- ---------------------------------------------------------------------
-- Departments + Employees
-- (departments.head_id -> employees is a deferred FK, checked at COMMIT)
-- ---------------------------------------------------------------------
INSERT INTO public.departments (id, name, code, head_id, location_id, badge_bg) VALUES
('DEP-ENG', 'Engineering',     'ENG', 'EMP-001', 'LOC-01', '#DBEAFE'),
('DEP-IT',  'IT',              'IT',  'EMP-005', 'LOC-01', '#D1FAE5'),
('DEP-HR',  'Human Resources', 'HR',  'EMP-008', 'LOC-01', '#FCE7F3'),
('DEP-FIN', 'Finance',         'FIN', 'EMP-010', 'LOC-03', '#FEF3C7'),
('DEP-SAL', 'Sales',           'SAL', 'EMP-012', 'LOC-03', '#EDE9FE'),
('DEP-OPS', 'Operations',      'OPS', 'EMP-014', 'LOC-01', '#FEE2E2');

INSERT INTO public.employees
  (id, name, role, department_id, location_id, email, joined_date, avatar_bg) VALUES
('EMP-001', 'Aarav Deshmukh',  'Engineering Director',        'DEP-ENG', 'LOC-01', 'aarav.deshmukh@nimbuscorp.in',  '2019-02-04', '#3B82F6'),
('EMP-002', 'Priya Nair',      'Senior Software Engineer',    'DEP-ENG', 'LOC-02', 'priya.nair@nimbuscorp.in',      '2021-07-19', '#EC4899'),
('EMP-003', 'Rohan Kulkarni',  'Software Engineer',           'DEP-ENG', 'LOC-01', 'rohan.kulkarni@nimbuscorp.in',  '2023-10-03', '#10B981'),
('EMP-004', 'Sneha Iyer',      'QA Engineer',                 'DEP-ENG', 'LOC-02', 'sneha.iyer@nimbuscorp.in',      '2023-10-09', '#F59E0B'),
('EMP-005', 'Vikram Singh',    'IT Manager',                  'DEP-IT',  'LOC-01', 'vikram.singh@nimbuscorp.in',    '2021-04-12', '#6366F1'),
('EMP-006', 'Neha Patil',      'IT Support Engineer',         'DEP-IT',  'LOC-01', 'neha.patil@nimbuscorp.in',      '2024-03-11', '#8B5CF6'),
('EMP-007', 'Arjun Reddy',     'Network Engineer',            'DEP-IT',  'LOC-02', 'arjun.reddy@nimbuscorp.in',     '2023-05-29', '#14B8A6'),
('EMP-008', 'Kavita Joshi',    'HR Manager',                  'DEP-HR',  'LOC-01', 'kavita.joshi@nimbuscorp.in',    '2019-03-11', '#F43F5E'),
('EMP-009', 'Manish Gupta',    'HR Executive',                'DEP-HR',  'LOC-03', 'manish.gupta@nimbuscorp.in',    '2025-01-27', '#0EA5E9'),
('EMP-010', 'Ananya Sharma',   'Finance Controller',          'DEP-FIN', 'LOC-03', 'ananya.sharma@nimbuscorp.in',   '2020-01-13', '#A855F7'),
('EMP-011', 'Rahul Mehta',     'Accountant',                  'DEP-FIN', 'LOC-03', 'rahul.mehta@nimbuscorp.in',     '2024-05-06', '#22C55E'),
('EMP-012', 'Ishaan Kapoor',   'Head of Sales',               'DEP-SAL', 'LOC-03', 'ishaan.kapoor@nimbuscorp.in',   '2022-08-01', '#EF4444'),
('EMP-013', 'Divya Menon',     'Account Executive',           'DEP-SAL', 'LOC-04', 'divya.menon@nimbuscorp.in',     '2024-08-05', '#F97316'),
('EMP-014', 'Tanmay Bhosale',  'Operations Manager',          'DEP-OPS', 'LOC-01', 'tanmay.bhosale@nimbuscorp.in',  '2020-09-14', '#64748B'),
('EMP-015', 'Farhan Sheikh',   'Facilities Technician',       'DEP-OPS', 'LOC-01', 'farhan.sheikh@nimbuscorp.in',   '2021-09-13', '#84CC16'),
('EMP-016', 'Meera Chandran',  'Calibration Technician',      'DEP-OPS', 'LOC-02', 'meera.chandran@nimbuscorp.in',  '2023-08-28', '#06B6D4'),
('EMP-017', 'Karan Malhotra',  'Sales Executive',             'DEP-SAL', 'LOC-03', 'karan.malhotra@nimbuscorp.in',  '2025-02-03', '#D946EF');

-- ---------------------------------------------------------------------
-- Assets  (created_at = date the asset was registered; history uses it)
-- Status starts as 'Available'; triggers set Assigned / In Maintenance.
-- ---------------------------------------------------------------------
INSERT INTO public.assets
  (id, name, code, serial, category_id, department_id, location_id, warranty_expiry, status, created_at) VALUES
-- Laptops
('AST-001', 'MacBook Pro 14" M3 Pro',        'LAP-001', 'FVFHX2KLQ6L7',      'CAT-LAP', 'DEP-ENG', 'LOC-02', '2027-01-09', 'Available', '2024-01-10 10:30:00+05:30'),
('AST-002', 'Dell Latitude 7440',            'LAP-002', 'JX4R9M3',           'CAT-LAP', 'DEP-ENG', 'LOC-01', '2026-10-04', 'Available', '2023-10-02 11:00:00+05:30'),
('AST-003', 'Dell Latitude 7440',            'LAP-003', 'B7T2N5K',           'CAT-LAP', 'DEP-ENG', 'LOC-02', '2026-10-04', 'Available', '2023-10-02 11:05:00+05:30'),
('AST-004', 'Lenovo ThinkPad T14 Gen 4',     'LAP-004', 'PF3K8L2N',          'CAT-LAP', 'DEP-IT',  'LOC-01', '2026-05-24', 'Available', '2023-05-25 10:15:00+05:30'),
('AST-005', 'Lenovo ThinkPad T14 Gen 4',     'LAP-005', 'PF3K9Q7X',          'CAT-LAP', 'DEP-IT',  'LOC-02', '2027-03-09', 'Available', '2024-03-10 10:00:00+05:30'),
('AST-006', 'HP EliteBook 840 G10',          'LAP-006', '5CG3412KLM',        'CAT-LAP', 'DEP-FIN', 'LOC-03', '2027-04-28', 'Available', '2024-04-29 12:00:00+05:30'),
('AST-007', 'HP EliteBook 840 G10',          'LAP-007', '5CG3412KLP',        'CAT-LAP', 'DEP-FIN', 'LOC-03', '2027-04-28', 'Available', '2024-04-29 12:05:00+05:30'),
('AST-008', 'MacBook Air 13" M2',            'LAP-008', 'H4W7D2LMQ9',        'CAT-LAP', 'DEP-SAL', 'LOC-04', '2026-08-04', 'Available', '2024-08-05 15:20:00+05:30'),
('AST-009', 'Dell Latitude 5440',            'LAP-009', 'D5N8R2W',           'CAT-LAP', 'DEP-HR',  'LOC-03', '2028-01-26', 'Available', '2025-01-27 11:40:00+05:30'),
('AST-010', 'Dell Latitude 5440',            'LAP-010', 'D5N8R3Y',           'CAT-LAP', 'DEP-SAL', 'LOC-03', '2028-01-26', 'Available', '2025-01-27 11:45:00+05:30'),
-- Monitors
('AST-011', 'Dell UltraSharp U2723QE 27"',   'MON-001', 'CN0T7H4V7444',      'CAT-MON', 'DEP-ENG', 'LOC-01', '2026-10-01', 'Available', '2023-10-02 11:20:00+05:30'),
('AST-012', 'LG 27UP850-W 27"',              'MON-002', '404NTPC1J245',      'CAT-MON', 'DEP-ENG', 'LOC-02', '2027-01-09', 'Available', '2024-01-10 10:45:00+05:30'),
('AST-013', 'Dell UltraSharp U2723QE 27"',   'MON-003', 'CN0T7H4V7445',      'CAT-MON', 'DEP-FIN', 'LOC-03', '2027-04-28', 'Available', '2024-04-29 12:10:00+05:30'),
-- Mobile
('AST-014', 'iPhone 15 Pro 256GB',           'MOB-001', 'F2LXK9M4QW',        'CAT-MOB', 'DEP-SAL', 'LOC-03', '2025-01-24', 'Available', '2024-01-25 14:00:00+05:30'),
('AST-015', 'Samsung Galaxy S24',            'MOB-002', 'R5CX40BQK7L',       'CAT-MOB', 'DEP-SAL', 'LOC-04', '2026-08-29', 'Available', '2024-08-30 10:30:00+05:30'),
('AST-016', 'Samsung Galaxy Tab S9',         'MOB-003', 'R52W70NXQ4A',       'CAT-MOB', 'DEP-OPS', 'LOC-01', '2025-10-27', 'Available', '2024-10-28 16:10:00+05:30'),
-- Networking
('AST-017', 'Cisco Catalyst 9200L-24P-4G',   'NET-001', 'FOC2634L0XM',       'CAT-NET', 'DEP-IT',  'LOC-02', '2028-07-19', 'Available', '2023-07-20 13:00:00+05:30'),
('AST-018', 'Ubiquiti UniFi U6 Pro AP',      'NET-002', 'E063DA8F2C41',      'CAT-NET', 'DEP-IT',  'LOC-01', '2026-01-29', 'Available', '2024-01-30 09:50:00+05:30'),
('AST-019', 'Fortinet FortiGate 60F',        'NET-003', 'FGT60FTK21012345',  'CAT-NET', 'DEP-IT',  'LOC-01', '2026-03-14', 'Available', '2023-03-15 10:20:00+05:30'),
-- Furniture
('AST-020', 'Herman Miller Aeron Chair',     'FUR-001', 'HM-AER-230214-0087','CAT-FUR', 'DEP-ENG', 'LOC-01', '2035-02-09', 'Available', '2023-02-10 14:30:00+05:30'),
('AST-021', 'Uplift V2 Standing Desk',       'FUR-002', 'UPL-V2-0044219',    'CAT-FUR', 'DEP-HR',  'LOC-01', '2032-05-27', 'Available', '2024-05-28 11:15:00+05:30'),
-- Instruments (require calibration)
('AST-022', 'Fluke 87V Digital Multimeter',  'INS-001', '58210347',          'CAT-INS', 'DEP-OPS', 'LOC-02', '2026-08-27', 'Available', '2023-08-28 12:30:00+05:30'),
('AST-023', 'Keysight DSOX1204G Oscilloscope','INS-002', 'CN63152841',       'CAT-INS', 'DEP-ENG', 'LOC-02', '2027-03-24', 'Available', '2024-03-25 10:40:00+05:30'),
('AST-024', 'Rigol DP832 Power Supply',      'INS-003', 'DP8A231600412',     'CAT-INS', 'DEP-ENG', 'LOC-02', '2027-03-24', 'Available', '2024-03-25 10:50:00+05:30'),
-- Printers
('AST-025', 'HP LaserJet Pro M404dn',        'PRN-001', 'PHBLN5K2Y7',        'CAT-PRN', 'DEP-OPS', 'LOC-01', '2026-04-02', 'Available', '2023-04-03 11:10:00+05:30'),
('AST-026', 'Canon imageRUNNER 2425',        'PRN-002', 'ZLK83329',          'CAT-PRN', 'DEP-FIN', 'LOC-03', '2026-10-29', 'Available', '2023-10-30 15:00:00+05:30'),
-- Desktops (one retired)
('AST-027', 'Dell OptiPlex 7080',            'DSK-001', 'H8K3P2W',           'CAT-DSK', 'DEP-HR',  'LOC-01', '2023-06-01', 'Retired',   '2020-06-01 10:00:00+05:30'),
('AST-028', 'Dell OptiPlex 7010',            'DSK-002', 'GT4R8N5',           'CAT-DSK', 'DEP-OPS', 'LOC-01', '2025-02-13', 'Available', '2022-02-14 10:00:00+05:30');

-- ---------------------------------------------------------------------
-- Assignments  (open assignment = return_date NULL)
-- Insert past assignments before the current one for the same asset.
-- ---------------------------------------------------------------------
INSERT INTO public.asset_assignments (asset_id, employee_id, assigned_date, return_date, notes) VALUES
-- Older / closed assignments first
('AST-004', 'EMP-005', '2023-06-01', '2024-03-15', 'Returned after IT manager received a new device'),
('AST-010', 'EMP-017', '2025-02-10', '2026-03-01', 'Returned when employee moved to BYOD pilot'),
('AST-027', 'EMP-008', '2020-06-10', '2024-05-30', 'Returned for decommissioning'),
-- Current assignments
('AST-001', 'EMP-002', '2024-01-15', NULL, 'Primary development machine'),
('AST-002', 'EMP-003', '2023-10-09', NULL, 'Issued on joining'),
('AST-003', 'EMP-004', '2023-10-12', NULL, 'Issued on joining'),
('AST-004', 'EMP-006', '2024-03-18', NULL, 'Reissued to new IT support engineer'),
('AST-005', 'EMP-007', '2024-03-20', NULL, 'Issued to network engineer'),
('AST-006', 'EMP-010', '2024-05-02', NULL, NULL),
('AST-007', 'EMP-011', '2024-05-06', NULL, 'Issued on joining'),
('AST-008', 'EMP-013', '2024-08-12', NULL, 'Issued on joining'),
('AST-009', 'EMP-009', '2025-02-03', NULL, 'Issued on joining'),
('AST-011', 'EMP-003', '2023-10-09', NULL, 'Issued with laptop'),
('AST-012', 'EMP-002', '2024-01-15', NULL, 'Issued with laptop'),
('AST-013', 'EMP-010', '2024-05-02', NULL, NULL),
('AST-014', 'EMP-012', '2024-02-01', NULL, 'Company phone for sales head'),
('AST-015', 'EMP-013', '2024-09-02', NULL, 'Company phone'),
('AST-016', 'EMP-014', '2024-11-05', NULL, 'Floor inspection tablet'),
('AST-017', 'EMP-007', '2023-08-01', NULL, 'Custodian: Bengaluru network closet'),
('AST-018', 'EMP-005', '2024-02-05', NULL, 'Custodian: Pune 3rd floor access point'),
('AST-019', 'EMP-005', '2023-03-20', NULL, 'Custodian: Pune perimeter firewall'),
('AST-020', 'EMP-001', '2023-02-14', NULL, NULL),
('AST-021', 'EMP-008', '2024-06-03', NULL, 'Ergonomic request approved'),
('AST-022', 'EMP-016', '2023-09-04', NULL, 'Calibration lab'),
('AST-023', 'EMP-004', '2024-04-02', NULL, 'QA test bench'),
('AST-025', 'EMP-015', '2023-04-10', NULL, 'Custodian: 2nd floor print room'),
('AST-026', 'EMP-010', '2023-11-06', NULL, 'Custodian: Finance print room'),
('AST-028', 'EMP-015', '2022-02-21', NULL, 'Facilities desk');
-- AST-024 (power supply) and AST-010 (laptop, returned) stay Available.

-- ---------------------------------------------------------------------
-- Work orders
-- ---------------------------------------------------------------------
INSERT INTO public.work_orders
  (id, asset_id, type, date, technician_id, cost_usd, status, notes, created_at) VALUES
('WO-0001', 'AST-022', 'Calibration',            '2024-08-20', 'EMP-016',  85.00, 'Completed',   'Annual calibration, certificate issued',          '2024-08-10 10:00:00+05:30'),
('WO-0002', 'AST-022', 'Calibration',            '2025-08-19', 'EMP-016',  90.00, 'Completed',   'Annual calibration, within tolerance',            '2025-08-05 10:00:00+05:30'),
('WO-0003', 'AST-022', 'Calibration',            '2026-10-06', 'EMP-016',  95.00, 'Scheduled',   'Annual calibration due',                          '2026-09-01 10:00:00+05:30'),
('WO-0004', 'AST-023', 'Calibration',            '2025-04-10', 'EMP-016', 210.00, 'Completed',   'First-year calibration',                          '2025-03-28 10:00:00+05:30'),
('WO-0005', 'AST-023', 'Calibration',            '2026-10-12', 'EMP-016', 220.00, 'Scheduled',   'Second calibration cycle',                        '2026-09-05 10:00:00+05:30'),
('WO-0006', 'AST-019', 'Corrective Repair',      '2026-09-17', 'EMP-007', 150.00, 'In Progress', 'HA link failure; replacement PSU on order',       '2026-09-16 15:30:00+05:30'),
('WO-0007', 'AST-025', 'Preventive Maintenance', '2025-04-15', 'EMP-015',  60.00, 'Completed',   'Roller and toner cartridge service',              '2025-04-10 10:00:00+05:30'),
('WO-0008', 'AST-026', 'Corrective Repair',      '2026-02-12', 'EMP-006', 140.00, 'Completed',   'Fuser unit replaced',                             '2026-02-09 10:00:00+05:30'),
('WO-0009', 'AST-002', 'Corrective Repair',      '2025-09-08', 'EMP-006', 120.00, 'Completed',   'Battery replaced',                                '2025-09-03 10:00:00+05:30'),
('WO-0010', 'AST-017', 'Preventive Maintenance', '2026-01-20', 'EMP-007',   0.00, 'Completed',   'Firmware upgrade and port audit',                 '2026-01-10 10:00:00+05:30'),
('WO-0011', 'AST-018', 'Inspection',             '2025-06-10', 'EMP-007',   0.00, 'Cancelled',   'Cancelled: covered by network audit',             '2025-06-01 10:00:00+05:30'),
('WO-0012', 'AST-001', 'Corrective Repair',      '2026-05-14', 'EMP-007', 250.00, 'Completed',   'Display panel replaced',                          '2026-05-10 10:00:00+05:30'),
('WO-0013', 'AST-016', 'Corrective Repair',      '2026-09-25', 'EMP-006', 180.00, 'Scheduled',   'Cracked screen replacement',                      '2026-09-18 10:00:00+05:30');

-- ---------------------------------------------------------------------
-- The retired asset was inserted directly as 'Retired', so add its
-- back-dated history entry manually.
-- ---------------------------------------------------------------------
INSERT INTO public.asset_history (asset_id, event_type, event_date, description, details)
VALUES ('AST-027', 'Retired', '2024-06-10 11:00:00+05:30',
        'Asset marked as Retired after decommissioning',
        '{"old_status": "Available", "new_status": "Retired"}');

-- Safety net: make sure every stored counter equals the real count
SELECT public.refresh_all_counts();

COMMIT;

-- ---------------------------------------------------------------------
-- Sanity checks (optional)
-- ---------------------------------------------------------------------
-- SELECT id, name, asset_count FROM public.categories ORDER BY id;
-- SELECT id, name, headcount, asset_count FROM public.departments ORDER BY id;
-- SELECT id, name, asset_count, employee_count FROM public.locations ORDER BY id;
-- SELECT status, count(*) FROM public.assets GROUP BY status;
-- SELECT event_date, event_type, description FROM public.v_asset_timeline
--  WHERE asset_id = 'AST-004' ORDER BY event_date;
