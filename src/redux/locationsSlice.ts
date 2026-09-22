import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { LocationItem } from '../types/location';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const INITIAL_LOCATIONS: LocationItem[] = [
  {
    id: 'LOC-001',
    name: 'HQ — Bengaluru',
    address: 'Whitefield, Bengaluru, IN',
    assetsCount: 214,
    employeesCount: 92,
    type: 'Headquarters',
  },
  {
    id: 'LOC-002',
    name: 'Plant 1 — Pune',
    address: 'Chakan MIDC, Pune, IN',
    assetsCount: 486,
    employeesCount: 138,
    type: 'Manufacturing',
  },
  {
    id: 'LOC-003',
    name: 'Warehouse A',
    address: 'Bhiwandi, MH, IN',
    assetsCount: 128,
    employeesCount: 24,
    type: 'Warehouse',
  },
  {
    id: 'LOC-004',
    name: 'R&D Lab',
    address: 'Whitefield, Bengaluru, IN',
    assetsCount: 74,
    employeesCount: 18,
    type: 'Research',
  },
];

interface LocationsState {
  list: LocationItem[];
  selectedLocationId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LocationsState = {
  list: INITIAL_LOCATIONS,
  selectedLocationId: null,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async (_, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) throw error;
      if (data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          address: row.address || '',
          assetsCount: row.asset_count ?? 0,
          employeesCount: row.employee_count ?? 0,
          type: row.type || 'Office',
        })) as LocationItem[];
      }
    }
    return INITIAL_LOCATIONS;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const addLocationAsync = createAsyncThunk('locations/addLocationAsync', async (newLoc: Omit<LocationItem, 'id'>, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const nextNum = state.locations.list.length + 1;
    const id = `LOC-${String(nextNum).padStart(3, '0')}`;
    const locToAdd = { id, ...newLoc };

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('locations').insert([{
        id: locToAdd.id,
        name: locToAdd.name,
        address: locToAdd.address,
        type: locToAdd.type,
      }]);
      if (error) throw error;
    }
    return locToAdd;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const updateLocationAsync = createAsyncThunk('locations/updateLocationAsync', async (loc: LocationItem, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('locations').update({
        name: loc.name,
        address: loc.address,
        type: loc.type,
      }).eq('id', loc.id);
      if (error) throw error;
    }
    return loc;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const deleteLocationAsync = createAsyncThunk('locations/deleteLocationAsync', async (locId: string, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('locations').delete().eq('id', locId);
      if (error) throw error;
    }
    return locId;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setLocations(state, action: PayloadAction<LocationItem[]>) {
      state.list = action.payload;
    },
    addLocation(state, action: PayloadAction<Omit<LocationItem, 'id'>>) {
      const nextNum = state.list.length + 1;
      const id = `LOC-${String(nextNum).padStart(3, '0')}`;
      const newLoc = { id, ...action.payload };
      state.list.push(newLoc);

      if (isSupabaseConfigured()) {
        supabase.from('locations').insert([{
          id: newLoc.id,
          name: newLoc.name,
          address: newLoc.address,
          type: newLoc.type,
          asset_count: newLoc.assetsCount,
          employee_count: newLoc.employeesCount,
        }]).then();
      }
    },
    updateLocation(state, action: PayloadAction<LocationItem>) {
      const index = state.list.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteLocation(state, action: PayloadAction<string>) {
      state.list = state.list.filter((l) => l.id !== action.payload);
    },
    setSelectedLocationId(state, action: PayloadAction<string | null>) {
      state.selectedLocationId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch locations';
      })
      .addCase(updateLocationAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteLocationAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((l) => l.id !== action.payload);
      })
      .addCase(addLocationAsync.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const {
  setLocations,
  addLocation,
  updateLocation,
  deleteLocation,
  setSelectedLocationId,
} = locationsSlice.actions;

export const selectAllLocations = (state: RootState) => state.locations.list;
export const selectSelectedLocationId = (state: RootState) => state.locations.selectedLocationId;

export default locationsSlice.reducer;
