import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { Asset } from '../types/asset';
import type { Employee } from '../types/employee';

// ─── Mock data (replace with RTK Query API calls when backend is ready) ────────

export const MOCK_ASSETS: Asset[] = [
  { id: 'AST-00184', name: 'MacBook Pro 16" M3',       code: 'AST-00184', category: 'Laptops',     serial: 'C02XL0GJHV29',  department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Priya Sharma', warrantyExpiry: '2027-02-11', status: 'In Use' },
  { id: 'AST-00203', name: 'Dell UltraSharp U2723QE',  code: 'AST-00203', category: 'Monitors',    serial: 'CN0DL8JX',      department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Priya Sharma', warrantyExpiry: '2027-03-04', status: 'In Use' },
  { id: 'AST-00204', name: 'Keychron K8 Pro Keyboard', code: 'AST-00204', category: 'Peripherals', serial: 'KC-K8P-992',     department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Priya Sharma', warrantyExpiry: '2026-10-12', status: 'In Use' },
  { id: 'AST-00205', name: 'Logitech MX Master 3S',    code: 'AST-00205', category: 'Peripherals', serial: 'LT-MX3S-102',    department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Priya Sharma', warrantyExpiry: '2026-06-01', status: 'In Use' },
  
  { id: 'AST-00844', name: 'Logitech MX Master 3S',    code: 'AST-00844', category: 'Peripherals', serial: 'LT-MX3S-4412',  department: 'Design',      location: 'HQ — Bengaluru',    assignedTo: 'Marcus Chen',  warrantyExpiry: '2026-06-01', status: 'In Use' },
  { id: 'AST-00845', name: 'Apple Studio Display 27"', code: 'AST-00845', category: 'Monitors',    serial: 'AP-SD-2701',    department: 'Design',      location: 'HQ — Bengaluru',    assignedTo: 'Marcus Chen',  warrantyExpiry: '2027-05-15', status: 'In Use' },
  { id: 'AST-00846', name: 'Mac Studio M2 Max',        code: 'AST-00846', category: 'Laptops',     serial: 'MS-M2M-8812',   department: 'Design',      location: 'HQ — Bengaluru',    assignedTo: 'Marcus Chen',  warrantyExpiry: '2027-08-20', status: 'In Use' },
  
  { id: 'AST-00902', name: 'HP EliteBook 840 G10',     code: 'AST-00902', category: 'Laptops',     serial: 'HP-8G10-3321',  department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Sofia Alvarez',warrantyExpiry: '2026-09-15', status: 'In Use' },
  { id: 'AST-00903', name: 'Zebra ZT411 Industrial',   code: 'AST-00903', category: 'Machines',    serial: 'ZB-ZT411-903',  department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Sofia Alvarez',warrantyExpiry: '2026-04-10', status: 'In Use' },
  { id: 'AST-00904', name: 'Honeywell Scanner 1950g',  code: 'AST-00904', category: 'Peripherals', serial: 'HW-1950G-11',   department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Sofia Alvarez',warrantyExpiry: '2025-12-01', status: 'In Use' },
  { id: 'AST-00905', name: 'iPad Pro 12.9" M2',        code: 'AST-00905', category: 'Peripherals', serial: 'IP-PRO-129',    department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Sofia Alvarez',warrantyExpiry: '2026-11-30', status: 'In Use' },
  { id: 'AST-00906', name: 'Dell Precision Workstation',code:'AST-00906', category: 'Laptops',     serial: 'DP-WS-5820',    department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Sofia Alvarez',warrantyExpiry: '2027-01-22', status: 'In Use' },
  
  { id: 'AST-00618', name: 'Mold — Housing v3',        code: 'AST-00618', category: 'Molds',       serial: 'MOLD-618',      department: 'Production',  location: 'Plant 1 — Pune',    assignedTo: 'Kenji Tanaka', warrantyExpiry: '2028-11-02', status: 'In Use' },
  { id: 'AST-00619', name: 'Haitian MA1200 Press',     code: 'AST-00619', category: 'Machines',    serial: 'HT-2211-8814',  department: 'Production',  location: 'Plant 1 — Pune',    assignedTo: 'Kenji Tanaka', warrantyExpiry: '2025-06-18', status: 'In Use' },
  
  { id: 'AST-00501', name: 'Dell XPS 15 9530',        code: 'AST-00501', category: 'Laptops',     serial: 'DXPS-9530-1',   department: 'Quality',     location: 'HQ — Bengaluru',    assignedTo: 'Amelia Wright',warrantyExpiry: '2026-10-05', status: 'In Use' },
  { id: 'AST-00502', name: 'Test Bench Analyzer',      code: 'AST-00502', category: 'Machines',    serial: 'TBA-4000-QA',   department: 'Quality',     location: 'HQ — Bengaluru',    assignedTo: 'Amelia Wright',warrantyExpiry: '2027-02-14', status: 'In Use' },
  { id: 'AST-00503', name: 'Oscilloscope Tektronix',  code: 'AST-00503', category: 'Peripherals', serial: 'TEK-TBS-2000',  department: 'Quality',     location: 'HQ — Bengaluru',    assignedTo: 'Amelia Wright',warrantyExpiry: '2026-07-30', status: 'In Use' },
  
  { id: 'AST-00401', name: 'Fluke Thermal Camera',     code: 'AST-00401', category: 'Peripherals', serial: 'FLK-TC-900',    department: 'Maintenance', location: 'Plant 1 — Pune',    assignedTo: 'David Okafor', warrantyExpiry: '2026-12-10', status: 'In Use' },
  { id: 'AST-00402', name: 'Bosch Pro Tool Set',       code: 'AST-00402', category: 'Peripherals', serial: 'BSH-PTS-402',   department: 'Maintenance', location: 'Plant 1 — Pune',    assignedTo: 'David Okafor', warrantyExpiry: '2025-09-01', status: 'In Use' },
  { id: 'AST-00403', name: 'CAT Diagnostic Scanner',   code: 'AST-00403', category: 'Machines',    serial: 'CAT-DS-881',    department: 'Maintenance', location: 'Plant 1 — Pune',    assignedTo: 'David Okafor', warrantyExpiry: '2027-03-20', status: 'In Use' },
  { id: 'AST-00404', name: 'Vibration Meter Kit',      code: 'AST-00404', category: 'Peripherals', serial: 'VMK-2200-P',   department: 'Maintenance', location: 'Plant 1 — Pune',    assignedTo: 'David Okafor', warrantyExpiry: '2026-05-18', status: 'In Use' },
  { id: 'AST-00405', name: 'Laser Alignment System',  code: 'AST-00405', category: 'Machines',    serial: 'LAS-990-M',     department: 'Maintenance', location: 'Plant 1 — Pune',    assignedTo: 'David Okafor', warrantyExpiry: '2028-01-11', status: 'In Use' },
  { id: 'AST-00406', name: 'Digital Multimeter Set',   code: 'AST-00406', category: 'Peripherals', serial: 'DMM-87V-99',    department: 'Maintenance', location: 'Plant 1 — Pune',    assignedTo: 'David Okafor', warrantyExpiry: '2026-08-30', status: 'In Use' },
  
  { id: 'AST-00301', name: 'MacBook Air M2',          code: 'AST-00301', category: 'Laptops',     serial: 'C02MBA-M2-01',  department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Léa Dubois',   warrantyExpiry: '2026-11-15', status: 'In Use' },
  { id: 'AST-00302', name: 'LG UltraFine 4K 27"',     code: 'AST-00302', category: 'Monitors',    serial: 'LG-UF4K-302',   department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Léa Dubois',   warrantyExpiry: '2027-03-04', status: 'In Use' },
  
  { id: 'AST-00701', name: 'Toyota 8FGU25 Forklift',   code: 'AST-00701', category: 'Forklifts',   serial: 'TY-8FGU25-901', department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Rahul Verma',  warrantyExpiry: '2024-04-22', status: 'In Use' },
  { id: 'AST-00702', name: 'Motorola Walkie-Talkie',   code: 'AST-00702', category: 'Peripherals', serial: 'MOT-WT-702',    department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Rahul Verma',  warrantyExpiry: '2025-10-10', status: 'In Use' },
  { id: 'AST-00703', name: 'Hand Pallet Truck 2.5T',   code: 'AST-00703', category: 'Forklifts',   serial: 'HPT-25T-703',   department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Rahul Verma',  warrantyExpiry: '2026-02-28', status: 'In Use' },

  { id: 'AST-01112', name: 'Canon imagePRESS C850',    code: 'AST-01112', category: 'Machines',    serial: 'CAN-C850-0092', department: 'Admin',       location: 'HQ — Bengaluru',    assignedTo: null,            warrantyExpiry: '2025-11-30', status: 'Available' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Priya Sharma',  role: 'Engineering Lead',     department: 'Engineering', location: 'HQ — Bengaluru', email: 'priya@atlas.co',  joinedDate: '2022-03-14', avatarBg: '#2563EB' },
  { id: 'EMP-002', name: 'Marcus Chen',   role: 'Design Director',      department: 'Design',      location: 'HQ — Bengaluru', email: 'marcus@atlas.co', joinedDate: '2021-08-10', avatarBg: '#0284C7' },
  { id: 'EMP-003', name: 'Sofia Alvarez', role: 'Ops Manager',          department: 'Operations',  location: 'Warehouse A',    email: 'sofia@atlas.co',  joinedDate: '2023-01-15', avatarBg: '#EA580C' },
  { id: 'EMP-004', name: 'Kenji Tanaka',  role: 'Production Head',      department: 'Production',  location: 'Plant 1 — Pune', email: 'kenji@atlas.co',  joinedDate: '2020-11-05', avatarBg: '#2563EB' },
  { id: 'EMP-005', name: 'Amelia Wright', role: 'QA Manager',           department: 'Quality',     location: 'HQ — Bengaluru', email: 'amelia@atlas.co', joinedDate: '2022-06-20', avatarBg: '#65A30D' },
  { id: 'EMP-006', name: 'David Okafor',  role: 'Maintenance Lead',     department: 'Maintenance', location: 'Plant 1 — Pune', email: 'david@atlas.co',  joinedDate: '2019-04-12', avatarBg: '#0284C7' },
  { id: 'EMP-007', name: 'Léa Dubois',    role: 'Software Engineer',    department: 'Engineering', location: 'HQ — Bengaluru', email: 'lea@atlas.co',    joinedDate: '2023-05-01', avatarBg: '#0D9488' },
  { id: 'EMP-008', name: 'Rahul Verma',   role: 'Warehouse Supervisor', department: 'Operations',  location: 'Warehouse A',    email: 'rahul@atlas.co',  joinedDate: '2022-09-18', avatarBg: '#EA580C' },
];

// ─── State ────────────────────────────────────────────────────────────────────

interface AssignAssetState {
  assets: Asset[];
  employees: Employee[];
  selectedAssetId: string | null;
  selectedEmployeeId: string | null;
  handoverDate: string;
  notes: string;
  isSubmitting: boolean;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const initialState: AssignAssetState = {
  assets: MOCK_ASSETS,
  employees: MOCK_EMPLOYEES,
  selectedAssetId: null,
  selectedEmployeeId: null,
  handoverDate: todayISO(),
  notes: '',
  isSubmitting: false,
};

// ─── Thunk ────────────────────────────────────────────────────────────────────

/** Simulates an API call to confirm the assignment. Replace body with real API call. */
export const confirmAssignment = createAsyncThunk(
  'assignAsset/confirmAssignment',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { selectedAssetId, selectedEmployeeId, handoverDate, notes } = state.assignAsset;
    // TODO: replace with real API call, e.g. await assignmentsApi.create({ ... })
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Assignment confirmed', { selectedAssetId, selectedEmployeeId, handoverDate, notes });
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const assignAssetSlice = createSlice({
  name: 'assignAsset',
  initialState,
  reducers: {
    assetSelected(state, action: PayloadAction<string>) {
      state.selectedAssetId = action.payload;
    },
    employeeSelected(state, action: PayloadAction<string>) {
      state.selectedEmployeeId = action.payload;
    },
    handoverDateChanged(state, action: PayloadAction<string>) {
      state.handoverDate = action.payload;
    },
    notesChanged(state, action: PayloadAction<string>) {
      state.notes = action.payload;
    },
    assignmentReset(state) {
      state.selectedAssetId = null;
      state.selectedEmployeeId = null;
      state.handoverDate = todayISO();
      state.notes = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmAssignment.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(confirmAssignment.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(confirmAssignment.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

export const {
  assetSelected,
  employeeSelected,
  handoverDateChanged,
  notesChanged,
  assignmentReset,
} = assignAssetSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllAssets = (state: RootState) => state.assignAsset.assets;
export const selectAllEmployees = (state: RootState) => state.assignAsset.employees;
export const selectSelectedAssetId = (state: RootState) => state.assignAsset.selectedAssetId;
export const selectSelectedEmployeeId = (state: RootState) => state.assignAsset.selectedEmployeeId;
export const selectHandoverDate = (state: RootState) => state.assignAsset.handoverDate;
export const selectNotes = (state: RootState) => state.assignAsset.notes;
export const selectIsSubmitting = (state: RootState) => state.assignAsset.isSubmitting;

export const selectSelectedAsset = (state: RootState): Asset | null =>
  state.assignAsset.assets.find((a) => a.id === state.assignAsset.selectedAssetId) ?? null;

export const selectSelectedEmployee = (state: RootState): Employee | null =>
  state.assignAsset.employees.find((e) => e.id === state.assignAsset.selectedEmployeeId) ?? null;

export const selectCanConfirm = (state: RootState): boolean =>
  state.assignAsset.selectedAssetId !== null &&
  state.assignAsset.selectedEmployeeId !== null &&
  state.assignAsset.handoverDate !== '';

export default assignAssetSlice.reducer;
