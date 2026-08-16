import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { Asset } from '../types/asset';
import type { Employee } from '../types/employee';

// ─── Mock data (replace with RTK Query API calls when backend is ready) ────────

export const MOCK_ASSETS: Asset[] = [
  { id: 'AST-00184', name: 'MacBook Pro 16" M3',       code: 'AST-00184', category: 'Laptops',     serial: 'C02XL0GJHV29',  department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Priya Sharma', warrantyExpiry: '2027-02-11', status: 'In Use' },
  { id: 'AST-00203', name: 'Dell UltraSharp U2723QE',  code: 'AST-00203', category: 'Monitors',    serial: 'CN0DL8JX',      department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Léa Dubois',   warrantyExpiry: '2027-03-04', status: 'In Use' },
  { id: 'AST-00512', name: 'Haitian MA1200 Press',     code: 'AST-00512', category: 'Machines',    serial: 'HT-2211-8814',  department: 'Production',  location: 'Plant 1 — Pune',    assignedTo: null,            warrantyExpiry: '2025-06-18', status: 'Maintenance' },
  { id: 'AST-00618', name: 'Mold — Housing v3',        code: 'AST-00618', category: 'Molds',       serial: 'MOLD-618',      department: 'Production',  location: 'Plant 1 — Pune',    assignedTo: 'Kenji Tanaka', warrantyExpiry: '2028-11-02', status: 'In Use' },
  { id: 'AST-00701', name: 'Toyota 8FGU25 Forklift',   code: 'AST-00701', category: 'Forklifts',   serial: 'TY-8FGU25-901', department: 'Operations',  location: 'Warehouse A',       assignedTo: 'Rahul Verma',  warrantyExpiry: '2024-04-22', status: 'In Use' },
  { id: 'AST-00844', name: 'Logitech MX Master 3S',    code: 'AST-00844', category: 'Peripherals', serial: 'LT-MX3S-4412',  department: 'Design',      location: 'HQ — Bengaluru',    assignedTo: null,            warrantyExpiry: '2026-06-01', status: 'Available' },
  { id: 'AST-00902', name: 'HP EliteBook 840 G10',     code: 'AST-00902', category: 'Laptops',     serial: 'HP-8G10-3321',  department: 'Finance',     location: 'HQ — Bengaluru',    assignedTo: 'Anika Mehta',  warrantyExpiry: '2026-09-15', status: 'In Use' },
  { id: 'AST-01112', name: 'Canon imagePRESS C850',    code: 'AST-01112', category: 'Machines',    serial: 'CAN-C850-0092', department: 'Admin',       location: 'HQ — Bengaluru',    assignedTo: null,            warrantyExpiry: '2025-11-30', status: 'Available' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Priya Sharma',  role: 'Engineering Lead',  department: 'Engineering', location: 'HQ — Bengaluru' },
  { id: 'EMP-002', name: 'Marcus Chen',   role: 'Design Director',   department: 'Design',      location: 'HQ — Bengaluru' },
  { id: 'EMP-003', name: 'Sofia Alvarez', role: 'Ops Manager',       department: 'Operations',  location: 'Warehouse A' },
  { id: 'EMP-004', name: 'Kenji Tanaka',  role: 'Production Head',   department: 'Production',  location: 'Plant 1 — Pune' },
  { id: 'EMP-005', name: 'Amelia Wright', role: 'QA Manager',        department: 'Quality',     location: 'HQ — Bengaluru' },
  { id: 'EMP-006', name: 'Léa Dubois',    role: 'Senior Engineer',   department: 'Engineering', location: 'HQ — Bengaluru' },
  { id: 'EMP-007', name: 'Rahul Verma',   role: 'Logistics Lead',    department: 'Operations',  location: 'Warehouse A' },
  { id: 'EMP-008', name: 'Anika Mehta',   role: 'Finance Analyst',   department: 'Finance',     location: 'HQ — Bengaluru' },
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
