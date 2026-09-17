import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { AssetCategoryItem } from '../types/category';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const INITIAL_CATEGORIES: AssetCategoryItem[] = [
  {
    id: 'CAT-001',
    name: 'Laptops',
    assetsCount: 184,
    iconType: 'laptop',
    bgColor: '#EEF2FF',
    iconColor: '#4F46E5',
    description: 'Portable workstation computers, notebooks, and ultrabooks.',
    depreciationMethod: 'Straight line',
    usefulLifeYears: 3,
  },
  {
    id: 'CAT-002',
    name: 'Monitors',
    assetsCount: 142,
    iconType: 'monitor',
    bgColor: '#E0F2FE',
    iconColor: '#0284C7',
    description: 'External display panels, 4K monitors, and desktop screens.',
    depreciationMethod: 'Straight line',
    usefulLifeYears: 5,
  },
  {
    id: 'CAT-003',
    name: 'Machines',
    assetsCount: 68,
    iconType: 'machine',
    bgColor: '#DCFCE7',
    iconColor: '#16A34A',
    description: 'Industrial production machinery, presses, and automated tools.',
    depreciationMethod: 'Declining balance',
    usefulLifeYears: 10,
    requiresCalibration: true,
  },
  {
    id: 'CAT-004',
    name: 'Molds',
    assetsCount: 42,
    iconType: 'mold',
    bgColor: '#FEF3C7',
    iconColor: '#D97706',
    description: 'Custom injection molds, casting dyes, and tooling fixtures.',
    depreciationMethod: 'Straight line',
    usefulLifeYears: 7,
  },
  {
    id: 'CAT-005',
    name: 'Forklifts',
    assetsCount: 18,
    iconType: 'forklift',
    bgColor: '#FEE2E2',
    iconColor: '#DC2626',
    description: 'Warehouse material handling forklifts, stackers, and pallet trucks.',
    depreciationMethod: 'Straight line',
    usefulLifeYears: 8,
    maintenanceInterval: 'Quarterly',
  },
  {
    id: 'CAT-006',
    name: 'Peripherals',
    assetsCount: 312,
    iconType: 'peripheral',
    bgColor: '#F3E8FF',
    iconColor: '#9333EA',
    description: 'Mice, mechanical keyboards, docking stations, and headsets.',
    depreciationMethod: 'Straight line',
    usefulLifeYears: 2,
  },
  {
    id: 'CAT-007',
    name: 'Furniture',
    assetsCount: 246,
    iconType: 'furniture',
    bgColor: '#CCFBF1',
    iconColor: '#0D9488',
    description: 'Ergonomic office chairs, standing desks, conference tables.',
    depreciationMethod: 'Straight line',
    usefulLifeYears: 7,
  },
  {
    id: 'CAT-008',
    name: 'Software Licenses',
    assetsCount: 96,
    iconType: 'software',
    bgColor: '#E0F2FE',
    iconColor: '#0284C7',
    description: 'Enterprise SaaS subscriptions, CAD software, and OS licenses.',
    depreciationMethod: 'None',
    usefulLifeYears: 1,
  },
];

interface CategoriesState {
  list: AssetCategoryItem[];
  selectedCategoryId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  list: INITIAL_CATEGORIES,
  selectedCategoryId: null,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          assetsCount: row.asset_count ?? 0,
          iconType: (row.icon as AssetCategoryItem['iconType']) || 'laptop',
          bgColor: row.color || '#EEF2FF',
          iconColor: '#4F46E5',
          description: row.description || '',
          depreciationMethod: row.depreciation_method || 'Straight line',
          usefulLifeYears: row.useful_life_years || 3,
        })) as AssetCategoryItem[];
      }
    }
    return INITIAL_CATEGORIES;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<AssetCategoryItem[]>) {
      state.list = action.payload;
    },
    addCategory(state, action: PayloadAction<Omit<AssetCategoryItem, 'id'>>) {
      const nextNum = state.list.length + 1;
      const id = `CAT-${String(nextNum).padStart(3, '0')}`;
      const newCat = { id, ...action.payload };
      state.list.push(newCat);

      if (isSupabaseConfigured()) {
        supabase.from('categories').insert([{
          id: newCat.id,
          name: newCat.name,
          icon: newCat.iconType,
          color: newCat.bgColor,
          asset_count: newCat.assetsCount,
          description: newCat.description,
          depreciation_method: newCat.depreciationMethod,
          useful_life_years: newCat.usefulLifeYears,
        }]).then();
      }
    },
    updateCategory(state, action: PayloadAction<AssetCategoryItem>) {
      const index = state.list.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.list = state.list.filter((c) => c.id !== action.payload);
    },
    setSelectedCategoryId(state, action: PayloadAction<string | null>) {
      state.selectedCategoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch categories';
      });
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setSelectedCategoryId,
} = categoriesSlice.actions;

export const selectAllCategories = (state: RootState) => state.categories.list;
export const selectSelectedCategoryId = (state: RootState) => state.categories.selectedCategoryId;

export default categoriesSlice.reducer;
