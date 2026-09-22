import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { Employee } from '../types/employee';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Priya Sharma',
    role: 'Engineering Lead',
    department: 'Engineering',
    location: 'HQ — Bengaluru',
    email: 'priya@atlas.co',
    joinedDate: '2022-03-14',
    avatarBg: '#2563EB',
  },
  {
    id: 'EMP-002',
    name: 'Marcus Chen',
    role: 'Design Director',
    department: 'Design',
    location: 'HQ — Bengaluru',
    email: 'marcus@atlas.co',
    joinedDate: '2021-08-10',
    avatarBg: '#0284C7',
  },
  {
    id: 'EMP-003',
    name: 'Sofia Alvarez',
    role: 'Ops Manager',
    department: 'Operations',
    location: 'Warehouse A',
    email: 'sofia@atlas.co',
    joinedDate: '2023-01-15',
    avatarBg: '#EA580C',
  },
  {
    id: 'EMP-004',
    name: 'Kenji Tanaka',
    role: 'Production Head',
    department: 'Production',
    location: 'Plant 1 — Pune',
    email: 'kenji@atlas.co',
    joinedDate: '2020-11-05',
    avatarBg: '#2563EB',
  },
  {
    id: 'EMP-005',
    name: 'Amelia Wright',
    role: 'QA Manager',
    department: 'Quality',
    location: 'HQ — Bengaluru',
    email: 'amelia@atlas.co',
    joinedDate: '2022-06-20',
    avatarBg: '#65A30D',
  },
  {
    id: 'EMP-006',
    name: 'David Okafor',
    role: 'Maintenance Lead',
    department: 'Maintenance',
    location: 'Plant 1 — Pune',
    email: 'david@atlas.co',
    joinedDate: '2019-04-12',
    avatarBg: '#0284C7',
  },
  {
    id: 'EMP-007',
    name: 'Léa Dubois',
    role: 'Software Engineer',
    department: 'Engineering',
    location: 'HQ — Bengaluru',
    email: 'lea@atlas.co',
    joinedDate: '2023-05-01',
    avatarBg: '#0D9488',
  },
  {
    id: 'EMP-008',
    name: 'Rahul Verma',
    role: 'Warehouse Supervisor',
    department: 'Operations',
    location: 'Warehouse A',
    email: 'rahul@atlas.co',
    joinedDate: '2022-09-18',
    avatarBg: '#EA580C',
  },
];

interface EmployeesState {
  list: Employee[];
  selectedEmployeeId: string | null;
  searchQuery: string;
  selectedDepartment: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  list: INITIAL_EMPLOYEES,
  selectedEmployeeId: null,
  searchQuery: '',
  selectedDepartment: 'all',
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('v_employees').select('*');
      if (error) throw error;
      if (data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          role: row.role,
          department: row.department,
          departmentId: row.department_id,
          location: row.location,
          locationId: row.location_id,
          email: row.email,
          joinedDate: row.joined_date,
          avatarBg: row.avatar_bg,
        })) as Employee[];
      }
    }
    return INITIAL_EMPLOYEES;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const getNextEmployeeId = (employees: Employee[]): string => {
  if (!employees || employees.length === 0) {
    return 'EMP-001';
  }

  let maxNum = 0;
  for (const emp of employees) {
    if (!emp || !emp.id) continue;
    const match = emp.id.match(/\d+/g);
    if (match) {
      const num = parseInt(match[match.length - 1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum > 0 ? maxNum + 1 : employees.length + 1;
  return `EMP-${String(nextNum).padStart(3, '0')}`;
};

export const addEmployeeAsync = createAsyncThunk(
  'employees/addEmployeeAsync',
  async (newEmp: (Omit<Employee, 'id'> & { id?: string }), { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      let allEmployees = [...state.employees.list];

      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase.from('employees').select('id');
          if (data && data.length > 0) {
            allEmployees = [
              ...allEmployees,
              ...data.map((r) => ({ id: r.id } as Employee)),
            ];
          }
        } catch {
          // Ignore and proceed with local list if Supabase query fails
        }
      }

      const generatedId = getNextEmployeeId(allEmployees);
      const id = newEmp.id || generatedId;

      const avatarBgs = ['#2563EB', '#0284C7', '#EA580C', '#65A30D', '#0D9488', '#9333EA'];
      const avatarBg = newEmp.avatarBg || avatarBgs[Math.floor(Math.random() * avatarBgs.length)];
      const empToAdd: Employee = { ...newEmp, id, avatarBg };

      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('employees').insert([{
          id: empToAdd.id,
          name: empToAdd.name,
          role: empToAdd.role,
          department_id: empToAdd.departmentId,
          location_id: empToAdd.locationId,
          email: empToAdd.email,
          joined_date: empToAdd.joinedDate,
          avatar_bg: empToAdd.avatarBg,
        }]);
        if (error) throw error;
      }
      return empToAdd;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteEmployeeAsync = createAsyncThunk('employees/deleteEmployeeAsync', async (employeeId: string, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('employees').delete().eq('id', employeeId);
      if (error) throw error;
    }
    return employeeId;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const updateEmployeeAsync = createAsyncThunk('employees/updateEmployeeAsync', async (employee: Employee, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const updatePayload: Record<string, any> = {
        name: employee.name,
        role: employee.role,
        email: employee.email,
        joined_date: employee.joinedDate,
        avatar_bg: employee.avatarBg,
      };
      if (employee.departmentId) updatePayload.department_id = employee.departmentId;
      if (employee.locationId) updatePayload.location_id = employee.locationId;
      
      const { error } = await supabase.from('employees').update(updatePayload).eq('id', employee.id);
      if (error) throw error;
    }
    return employee;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.list = action.payload;
    },
    addEmployee(state, action: PayloadAction<Omit<Employee, 'id'> & { id?: string }>) {
      const id = action.payload.id || getNextEmployeeId(state.list);
      const avatarBgs = ['#2563EB', '#0284C7', '#EA580C', '#65A30D', '#0D9488', '#9333EA'];
      const avatarBg = action.payload.avatarBg || avatarBgs[Math.floor(Math.random() * avatarBgs.length)];
      const newEmp = { ...action.payload, id, avatarBg };
      state.list.unshift(newEmp);

      if (isSupabaseConfigured()) {
        supabase.from('employees').insert([{
          id: newEmp.id,
          name: newEmp.name,
          role: newEmp.role,
          department: newEmp.department,
          location: newEmp.location,
          email: newEmp.email,
          joined_date: newEmp.joinedDate,
          avatar_bg: newEmp.avatarBg,
        }]).then();
      }
    },
    updateEmployee(state, action: PayloadAction<Employee>) {
      const index = state.list.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteEmployee(state, action: PayloadAction<string>) {
      state.list = state.list.filter((e) => e.id !== action.payload);
      if (state.selectedEmployeeId === action.payload) {
        state.selectedEmployeeId = null;
      }
    },
    setSelectedEmployeeId(state, action: PayloadAction<string | null>) {
      state.selectedEmployeeId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedDepartment(state, action: PayloadAction<string>) {
      state.selectedDepartment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch employees';
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
        if (state.selectedEmployeeId === action.payload) state.selectedEmployeeId = null;
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(addEmployeeAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const {
  setEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSelectedEmployeeId,
  setSearchQuery,
  setSelectedDepartment,
} = employeesSlice.actions;

export const selectAllEmployeesList = (state: RootState) => state.employees.list;
export const selectSelectedEmployeeId = (state: RootState) => state.employees.selectedEmployeeId;
export const selectSearchQuery = (state: RootState) => state.employees.searchQuery;
export const selectSelectedDepartment = (state: RootState) => state.employees.selectedDepartment;

export const selectEmployeeById = (state: RootState, id: string | null) =>
  id ? state.employees.list.find((e) => e.id === id) ?? null : null;

export default employeesSlice.reducer;
