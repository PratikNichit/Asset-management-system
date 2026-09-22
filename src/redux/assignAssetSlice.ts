import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { updateAsset } from './assetsSlice';
import type { Asset } from '../types/asset';
import type { Employee } from '../types/employee';

// ─── Mock data (kept as fallback; real data comes from state.assets / state.employees) ──

export const MOCK_ASSETS: Asset[] = [
  { id: 'AST-00184', name: 'MacBook Pro 16" M3',       code: 'AST-00184', category: 'Laptops',     serial: 'C02XL0GJHV29',  department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Priya Sharma', warrantyExpiry: '2027-02-11', status: 'In Use' },
  { id: 'AST-00203', name: 'Dell UltraSharp U2723QE',  code: 'AST-00203', category: 'Monitors',    serial: 'CN0DL8JX',      department: 'Engineering', location: 'HQ — Bengaluru',    assignedTo: 'Priya Sharma', warrantyExpiry: '2027-03-04', status: 'In Use' },
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
  selectedAssetId: string | null;
  selectedEmployeeId: string | null;
  handoverDate: string;
  notes: string;
  isSubmitting: boolean;
  error: string | null;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const initialState: AssignAssetState = {
  selectedAssetId: null,
  selectedEmployeeId: null,
  handoverDate: todayISO(),
  notes: '',
  isSubmitting: false,
  error: null,
};

// ─── Thunk ────────────────────────────────────────────────────────────────────

/**
 * Confirms an asset assignment:
 * - Updates the asset's assigned_to and status in Supabase (if configured).
 * - Dispatches updateAsset to keep the Redux assets slice in sync.
 * - Resets form state on success (handled in extraReducers).
 */
export const confirmAssignment = createAsyncThunk(
  'assignAsset/confirmAssignment',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { selectedAssetId, selectedEmployeeId } = state.assignAsset;

    if (!selectedAssetId || !selectedEmployeeId) {
      return rejectWithValue('Asset and employee must both be selected.');
    }

    // Read from the real, Supabase-backed slices.
    const asset = state.assets.items.find((a) => a.id === selectedAssetId);
    const employee = state.employees.list.find((e) => e.id === selectedEmployeeId);

    if (!asset || !employee) {
      return rejectWithValue('Selected asset or employee not found.');
    }

    const updatedAsset = {
      ...asset,
      assignedTo: employee.name,
      status: 'In Use' as const,
    };

    try {
      if (isSupabaseConfigured()) {
        // Close existing open assignment if any
        if (asset.assignedToId) {
          const { error: closeError } = await supabase
            .from('asset_assignments')
            .update({ return_date: state.assignAsset.handoverDate })
            .eq('asset_id', selectedAssetId)
            .is('return_date', null);
            
          if (closeError) throw closeError;
        }

        const { error } = await supabase
          .from('asset_assignments')
          .insert({
             asset_id: selectedAssetId,
             employee_id: selectedEmployeeId,
             assigned_date: state.assignAsset.handoverDate,
             notes: state.assignAsset.notes
          });

        if (error) throw error;
      }

      // Keep the Redux assets slice in sync regardless of Supabase.
      dispatch(updateAsset(updatedAsset));

      return updatedAsset;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
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
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmAssignment.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(confirmAssignment.fulfilled, (state) => {
        state.isSubmitting = false;
        // Reset form after successful assignment.
        state.selectedAssetId = null;
        state.selectedEmployeeId = null;
        state.handoverDate = todayISO();
        state.notes = '';
        state.error = null;
      })
      .addCase(confirmAssignment.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Failed to confirm assignment.';
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

// Read from the real, Supabase-backed slices — not the local mock lists.
export const selectAllAssets = (state: RootState) => state.assets.items;
export const selectAllEmployees = (state: RootState) => state.employees.list;

export const selectSelectedAssetId = (state: RootState) => state.assignAsset.selectedAssetId;
export const selectSelectedEmployeeId = (state: RootState) => state.assignAsset.selectedEmployeeId;
export const selectHandoverDate = (state: RootState) => state.assignAsset.handoverDate;
export const selectNotes = (state: RootState) => state.assignAsset.notes;
export const selectIsSubmitting = (state: RootState) => state.assignAsset.isSubmitting;
export const selectAssignError = (state: RootState) => state.assignAsset.error;

export const selectSelectedAsset = (state: RootState) =>
  state.assets.items.find((a) => a.id === state.assignAsset.selectedAssetId) ?? null;

export const selectSelectedEmployee = (state: RootState) =>
  state.employees.list.find((e) => e.id === state.assignAsset.selectedEmployeeId) ?? null;

export const selectCanConfirm = (state: RootState): boolean =>
  state.assignAsset.selectedAssetId !== null &&
  state.assignAsset.selectedEmployeeId !== null &&
  state.assignAsset.handoverDate !== '';

export default assignAssetSlice.reducer;
