import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Asset } from '../types/asset';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ASSETS: Asset[] = [
  {
    id: 'AST-00184',
    name: 'MacBook Pro 16" M3',
    code: 'AST-00184',
    category: 'Laptops',
    serial: 'C02XL0GJHV29',
    department: 'Engineering',
    location: 'HQ — Bengaluru',
    assignedTo: 'Priya Sharma',
    warrantyExpiry: '2027-02-11',
    status: 'In Use',
  },
  {
    id: 'AST-00203',
    name: 'Dell UltraSharp U2723QE',
    code: 'AST-00203',
    category: 'Monitors',
    serial: 'CN0DL8JX',
    department: 'Engineering',
    location: 'HQ — Bengaluru',
    assignedTo: 'Priya Sharma',
    warrantyExpiry: '2027-03-04',
    status: 'In Use',
  },
  {
    id: 'AST-00512',
    name: 'Haitian MA1200 Press',
    code: 'AST-00512',
    category: 'Machines',
    serial: 'HT-2211-8814',
    department: 'Production',
    location: 'Plant 1 — Pune',
    assignedTo: null,
    warrantyExpiry: '2025-06-18',
    status: 'Maintenance',
  },
  {
    id: 'AST-00618',
    name: 'Mold — Housing v3',
    code: 'AST-00618',
    category: 'Molds',
    serial: 'MOLD-618',
    department: 'Production',
    location: 'Plant 1 — Pune',
    assignedTo: 'Kenji Tanaka',
    warrantyExpiry: '2028-11-02',
    status: 'In Use',
  },
  {
    id: 'AST-00701',
    name: 'Toyota 8FGU25 Forklift',
    code: 'AST-00701',
    category: 'Forklifts',
    serial: 'TY-8FGU25-901',
    department: 'Operations',
    location: 'Warehouse A',
    assignedTo: 'Rahul Verma',
    warrantyExpiry: '2024-04-22',
    status: 'In Use',
  },
  {
    id: 'AST-00844',
    name: 'Logitech MX Master 3S',
    code: 'AST-00844',
    category: 'Peripherals',
    serial: 'LT-MX3S-4412',
    department: 'Design',
    location: 'HQ — Bengaluru',
    assignedTo: null,
    warrantyExpiry: '2026-06-01',
    status: 'Available',
  },
  {
    id: 'AST-00902',
    name: 'HP EliteBook 840 G10',
    code: 'AST-00902',
    category: 'Laptops',
    serial: 'HP-8G10-3321',
    department: 'Finance',
    location: 'HQ — Bengaluru',
    assignedTo: 'Anika Mehta',
    warrantyExpiry: '2026-09-15',
    status: 'In Use',
  },
  {
    id: 'AST-01005',
    name: 'Samsung 34" Curved Monitor',
    code: 'AST-01005',
    category: 'Monitors',
    serial: 'SN-34C-7721',
    department: 'Design',
    location: 'HQ — Bengaluru',
    assignedTo: 'Marcus Chen',
    warrantyExpiry: '2027-01-20',
    status: 'In Use',
  },
  {
    id: 'AST-01112',
    name: 'Canon imagePRESS C850',
    code: 'AST-01112',
    category: 'Machines',
    serial: 'CAN-C850-0092',
    department: 'Admin',
    location: 'HQ — Bengaluru',
    assignedTo: null,
    warrantyExpiry: '2025-11-30',
    status: 'Available',
  },
  {
    id: 'AST-01233',
    name: 'Mold — Bracket A4',
    code: 'AST-01233',
    category: 'Molds',
    serial: 'MOLD-A4-22',
    department: 'Production',
    location: 'Plant 2 — Pune',
    assignedTo: null,
    warrantyExpiry: null,
    status: 'Retired',
  },
  {
    id: 'AST-01300',
    name: 'Crown RC 5500 Forklift',
    code: 'AST-01300',
    category: 'Forklifts',
    serial: 'CR-RC5500-11',
    department: 'Operations',
    location: 'Warehouse A',
    assignedTo: 'Sofia Alvarez',
    warrantyExpiry: '2026-03-08',
    status: 'In Use',
  },
  {
    id: 'AST-01401',
    name: 'Jabra Evolve2 85 Headset',
    code: 'AST-01401',
    category: 'Peripherals',
    serial: 'JB-E285-9901',
    department: 'Engineering',
    location: 'HQ — Bengaluru',
    assignedTo: 'Priya Sharma',
    warrantyExpiry: '2025-08-14',
    status: 'In Use',
  },
];

interface AssetsState {
  items: Asset[];
}

const initialState: AssetsState = {
  items: MOCK_ASSETS,
};

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      state.items.unshift(action.payload);
    },
    updateAsset: (state, action: PayloadAction<Asset>) => {
      const index = state.items.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
    setAssets: (state, action: PayloadAction<Asset[]>) => {
      state.items = action.payload;
    }
  },
});

export const { addAsset, updateAsset, removeAsset, setAssets } = assetsSlice.actions;

export const selectAllAssets = (state: { assets: AssetsState }) => state.assets.items;
export const selectAssetById = (state: { assets: AssetsState }, assetId: string) => 
  state.assets.items.find(a => a.id === assetId || a.code === assetId) || null;

export default assetsSlice.reducer;
