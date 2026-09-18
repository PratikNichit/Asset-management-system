import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchAssets, MOCK_ASSETS } from './assetsSlice';

export interface DashboardStatData {
  id: string;
  value: string | number;
  trendValue?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  note?: string;
}

export interface DashboardState {
  stats: Record<string, DashboardStatData>;
  isLoading: boolean;
  error: string | null;
}

// ─── Stat Computation Helper ──────────────────────────────────────────────────

export function computeStatsFromAssets(assets: any[]): Record<string, DashboardStatData> {
  const total = assets.length;
  const assigned = assets.filter(
    (a) => (a.status && a.status.toLowerCase() === 'in use') || Boolean(a.assigned_to || a.assignedTo)
  ).length;

  const available = assets.filter(
    (a) => a.status && a.status.toLowerCase() === 'available'
  ).length;

  const maintenance = assets.filter(
    (a) => a.status && a.status.toLowerCase() === 'maintenance'
  ).length;

  const retired = assets.filter(
    (a) => a.status && a.status.toLowerCase() === 'retired'
  ).length;

  const now = new Date();
  let expiringSoonCount = 0;
  let expiredCount = 0;

  assets.forEach((a) => {
    const rawDate = a.warranty_expiry || a.warrantyExpiry;
    if (rawDate) {
      const expDate = new Date(rawDate);
      if (!isNaN(expDate.getTime())) {
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 90) {
          expiringSoonCount++;
        } else if (diffDays < 0) {
          expiredCount++;
        }
      }
    }
  });

  const warrantyDisplayCount = expiringSoonCount > 0 ? expiringSoonCount : (expiredCount > 0 ? expiredCount : 0);
  const warrantyNote = expiringSoonCount > 0
    ? 'next 90 days'
    : expiredCount > 0
      ? `${expiredCount} expired`
      : 'All up to date';

  const assignedPct = total > 0 ? Math.round((assigned / total) * 100) : 0;
  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;
  const maintenancePct = total > 0 ? Math.round((maintenance / total) * 100) : 0;

  return {
    total_assets: {
      id: 'total_assets',
      value: total.toLocaleString(),
      trendValue: total > 0 ? `${total}` : '0',
      trendDirection: 'up',
      trendLabel: 'total assets',
    },
    assigned: {
      id: 'assigned',
      value: assigned.toLocaleString(),
      trendValue: `${assignedPct}%`,
      trendDirection: 'up',
      trendLabel: 'of total',
    },
    available: {
      id: 'available',
      value: available.toLocaleString(),
      trendValue: `${availablePct}%`,
      trendDirection: availablePct > 0 ? 'up' : 'neutral',
      trendLabel: 'of total',
    },
    under_maintenance: {
      id: 'under_maintenance',
      value: maintenance.toLocaleString(),
      trendValue: `${maintenancePct}%`,
      trendDirection: maintenance > 0 ? 'down' : 'neutral',
      trendLabel: 'of total',
    },
    warranty_expiring: {
      id: 'warranty_expiring',
      value: warrantyDisplayCount.toLocaleString(),
      note: warrantyNote,
    },
    retired_ytd: {
      id: 'retired_ytd',
      value: retired.toLocaleString(),
      note: 'YTD',
    },
  };
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: DashboardState = {
  stats: computeStatsFromAssets(MOCK_ASSETS),
  isLoading: false,
  error: null,
};

// ─── Async Thunk: GET Dashboard Stats ─────────────────────────────────────────

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('assets').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return computeStatsFromAssets(data);
        }
      }
      return computeStatsFromAssets(MOCK_ASSETS);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardStats: (state, action: PayloadAction<Record<string, DashboardStatData>>) => {
      state.stats = action.payload;
    },
    updateDashboardStat: (state, action: PayloadAction<DashboardStatData>) => {
      if (state.stats[action.payload.id]) {
        state.stats[action.payload.id] = {
          ...state.stats[action.payload.id],
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch dashboard stats';
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.stats = computeStatsFromAssets(action.payload);
        }
      });
  },
});

export const { setDashboardStats, updateDashboardStat } = dashboardSlice.actions;

export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.stats;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;

export default dashboardSlice.reducer;
