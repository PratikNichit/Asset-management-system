import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { LocationItem } from '../types/location';

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
}

const initialState: LocationsState = {
  list: INITIAL_LOCATIONS,
  selectedLocationId: null,
};

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
      state.list.push({
        id,
        ...action.payload,
      });
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
