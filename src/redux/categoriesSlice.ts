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
    depreciationMethod: 'Straight Line',
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
    depreciationMethod: 'Straight Line',
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
    depreciationMethod: 'Declining Balance',
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
    depreciationMethod: 'Straight Line',
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
    depreciationMethod: 'Straight Line',
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
    depreciationMethod: 'Straight Line',
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
    depreciationMethod: 'Straight Line',
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
    depreciationMethod: undefined,
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
      if (data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          assetsCount: row.asset_count ?? 0,
          iconType: (row.icon as AssetCategoryItem['iconType']) || 'laptop',
          bgColor: row.color || '#EEF2FF',
          iconColor: '#4F46E5',
          description: row.description || '',
          depreciationMethod: row.depreciation_method || 'Straight Line',
          usefulLifeYears: row.useful_life_years || 3,
        })) as AssetCategoryItem[];
      }
    }
    return INITIAL_CATEGORIES;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

const normalizeDepreciationMethod = (method?: string | null): string | null => {
  if (!method || method.trim().toLowerCase() === 'none') return null;
  const lower = method.trim().toLowerCase();
  if (lower === 'straight line') return 'Straight Line';
  if (lower === 'declining balance') return 'Declining Balance';
  return method.trim();
};

export const addCategoryAsync = createAsyncThunk('categories/addCategoryAsync', async (newCat: Omit<AssetCategoryItem, 'id'>, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const nextNum = state.categories.list.length + 1;
    const id = `CAT-${String(nextNum).padStart(3, '0')}`;
    const normalizedMethod = normalizeDepreciationMethod(newCat.depreciationMethod);
    const catToAdd = {
      id,
      ...newCat,
      depreciationMethod: normalizedMethod ?? undefined,
    };

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('categories').insert([{
        id: catToAdd.id,
        name: catToAdd.name,
        icon: catToAdd.iconType,
        color: catToAdd.bgColor,
        description: catToAdd.description,
        depreciation_method: normalizedMethod,
        useful_life_years: catToAdd.usefulLifeYears,
      }]);
      if (error) throw error;
    }
    return catToAdd;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const updateCategoryAsync = createAsyncThunk('categories/updateCategoryAsync', async (cat: AssetCategoryItem, { rejectWithValue }) => {
  try {
    const normalizedMethod = normalizeDepreciationMethod(cat.depreciationMethod);
    const catToUpdate = {
      ...cat,
      depreciationMethod: normalizedMethod ?? undefined,
    };

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('categories').update({
        name: catToUpdate.name,
        icon: catToUpdate.iconType,
        color: catToUpdate.bgColor,
        description: catToUpdate.description,
        depreciation_method: normalizedMethod,
        useful_life_years: catToUpdate.usefulLifeYears,
      }).eq('id', catToUpdate.id);
      if (error) throw error;
    }
    return catToUpdate;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const deleteCategoryAsync = createAsyncThunk('categories/deleteCategoryAsync', async (catId: string, { rejectWithValue }) => {
  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('categories').delete().eq('id', catId);
      if (error) throw error;
    }
    return catId;
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
      const normalizedMethod = normalizeDepreciationMethod(action.payload.depreciationMethod);
      const newCat = {
        id,
        ...action.payload,
        depreciationMethod: normalizedMethod ?? undefined,
      };
      state.list.push(newCat);

      if (isSupabaseConfigured()) {
        supabase.from('categories').insert([{
          id: newCat.id,
          name: newCat.name,
          icon: newCat.iconType,
          color: newCat.bgColor,
          asset_count: newCat.assetsCount,
          description: newCat.description,
          depreciation_method: normalizedMethod,
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
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.list.push(action.payload);
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
