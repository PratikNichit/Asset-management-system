import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { Department } from '../types/department';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'DEP-001',
    name: 'Engineering',
    code: 'EN',
    head: 'Priya Sharma',
    membersCount: 48,
    assetsCount: 132,
    badgeBg: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
  },
  {
    id: 'DEP-002',
    name: 'Design',
    code: 'DE',
    head: 'Marcus Chen',
    membersCount: 12,
    assetsCount: 34,
    badgeBg: 'linear-gradient(135deg, #0D9488 0%, #0284C7 100%)',
  },
  {
    id: 'DEP-003',
    name: 'Operations',
    code: 'OP',
    head: 'Sofia Alvarez',
    membersCount: 22,
    assetsCount: 78,
    badgeBg: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)',
  },
  {
    id: 'DEP-004',
    name: 'Production',
    code: 'PR',
    head: 'Kenji Tanaka',
    membersCount: 64,
    assetsCount: 210,
    badgeBg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  },
  {
    id: 'DEP-005',
    name: 'Quality',
    code: 'QU',
    head: 'Amelia Wright',
    membersCount: 14,
    assetsCount: 41,
    badgeBg: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
  },
  {
    id: 'DEP-006',
    name: 'Maintenance',
    code: 'MA',
    head: 'David Okafor',
    membersCount: 18,
    assetsCount: 62,
    badgeBg: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
  },
];

interface DepartmentsState {
  list: Department[];
  selectedDepartmentId: string | null;
}

const initialState: DepartmentsState = {
  list: INITIAL_DEPARTMENTS,
  selectedDepartmentId: null,
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setDepartments(state, action: PayloadAction<Department[]>) {
      state.list = action.payload;
    },
    addDepartment(state, action: PayloadAction<Omit<Department, 'id'>>) {
      const nextNum = state.list.length + 1;
      const id = `DEP-${String(nextNum).padStart(3, '0')}`;
      const badges = [
        'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
        'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
      ];
      const badgeBg = action.payload.badgeBg || badges[Math.floor(Math.random() * badges.length)];
      state.list.push({
        id,
        badgeBg,
        ...action.payload,
      });
    },
    updateDepartment(state, action: PayloadAction<Department>) {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteDepartment(state, action: PayloadAction<string>) {
      state.list = state.list.filter((d) => d.id !== action.payload);
    },
    setSelectedDepartmentId(state, action: PayloadAction<string | null>) {
      state.selectedDepartmentId = action.payload;
    },
  },
});

export const {
  setDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  setSelectedDepartmentId,
} = departmentsSlice.actions;

export const selectAllDepartments = (state: RootState) => state.departments.list;
export const selectSelectedDepartmentId = (state: RootState) => state.departments.selectedDepartmentId;

export default departmentsSlice.reducer;
