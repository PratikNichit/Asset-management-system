import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStatData {
  id: string;
  value: string | number;
  trendValue?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  note?: string;
}

export interface MovementPoint {
  key: string;    // 2026-07
  label: string;  // Jul
  added: number;
  retired: number;
}

export type MovementRange = '7M' | '1Y' | 'All';

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  date: string; // ISO date
}

export interface DashboardState {
  stats: Record<string, DashboardStatData>;
  movement: MovementPoint[];
  movementRange: MovementRange;
  activity: ActivityItem[];
  isLoading: boolean;
  analyticsLoading: boolean;
  error: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type StatusBucket = 'assigned' | 'available' | 'maintenance' | 'retired' | 'other';

/** Handles both UI statuses (v_assets) and raw DB statuses (assets table). */
export function bucketStatus(status?: string | null): StatusBucket {
  const s = (status ?? '').toLowerCase().trim();
  if (s === 'in use' || s === 'assigned') return 'assigned';
  if (s === 'available') return 'available';
  if (s.includes('maintenance')) return 'maintenance';
  if (s === 'retired') return 'retired';
  return 'other';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function computeStatsFromAssets(assets: any[]): Record<string, DashboardStatData> {
  const now = new Date();
  const total = assets.length;
  let assigned = 0;
  let available = 0;
  let maintenance = 0;
  let retiredYtd = 0;
  let expiringSoon = 0;
  let expired = 0;
  let addedThisMonth = 0;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const a of assets) {
    const bucket = bucketStatus(a.status);
    if (bucket === 'assigned') assigned++;
    else if (bucket === 'available') available++;
    else if (bucket === 'maintenance') maintenance++;
    else if (bucket === 'retired') {
      const d = new Date(a.retired_at ?? a.updated_at ?? '');
      // If we have no date at all, count it; otherwise only count this year.
      if (isNaN(d.getTime()) || d.getFullYear() === now.getFullYear()) retiredYtd++;
    }

    const rawWarranty = a.warranty_expiry ?? a.warrantyExpiry;
    if (rawWarranty && bucket !== 'retired') {
      const exp = new Date(rawWarranty);
      if (!isNaN(exp.getTime())) {
        const diffDays = Math.ceil((exp.getTime() - now.getTime()) / 86_400_000);
        if (diffDays >= 0 && diffDays <= 90) expiringSoon++;
        else if (diffDays < 0) expired++;
      }
    }

    const created = new Date(a.created_at ?? '');
    if (!isNaN(created.getTime()) && created >= monthStart) addedThisMonth++;
  }

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const before = total - addedThisMonth;
  const growth = before > 0 ? (addedThisMonth / before) * 100 : 0;

  return {
    total_assets: {
      id: 'total_assets',
      value: total.toLocaleString(),
      trendValue: `${growth.toFixed(1)}%`,
      trendDirection: growth > 0 ? 'up' : 'neutral',
      trendLabel: 'vs last month',
    },
    assigned: {
      id: 'assigned',
      value: assigned.toLocaleString(),
      trendValue: `${pct(assigned)}%`,
      trendDirection: assigned > 0 ? 'up' : 'neutral',
      trendLabel: 'of total',
    },
    available: {
      id: 'available',
      value: available.toLocaleString(),
      trendValue: `${pct(available)}%`,
      trendDirection: available > 0 ? 'up' : 'neutral',
      trendLabel: 'of total',
    },
    under_maintenance: {
      id: 'under_maintenance',
      value: maintenance.toLocaleString(),
      trendValue: `${pct(maintenance)}%`,
      trendDirection: maintenance > 0 ? 'down' : 'neutral',
      trendLabel: 'of total',
    },
    warranty_expiring: {
      id: 'warranty_expiring',
      value: (expiringSoon > 0 ? expiringSoon : expired).toLocaleString(),
      note: expiringSoon > 0 ? 'next 90 days' : expired > 0 ? `${expired} expired` : 'All up to date',
    },
    retired_ytd: {
      id: 'retired_ytd',
      value: retiredYtd.toLocaleString(),
      note: 'YTD',
    },
  };
}

const pad = (n: number) => String(n).padStart(2, '0');
const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMovementSeries(rows: any[]): MovementPoint[] {
  const now = new Date();
  const added = new Map<string, number>();
  const retired = new Map<string, number>();
  let earliest = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  for (const r of rows) {
    const created = new Date(r.created_at ?? '');
    if (!isNaN(created.getTime())) {
      added.set(monthKey(created), (added.get(monthKey(created)) ?? 0) + 1);
      if (created < earliest) earliest = new Date(created.getFullYear(), created.getMonth(), 1);
    }
    if (bucketStatus(r.status) === 'retired') {
      const d = new Date(r.retired_at ?? r.updated_at ?? '');
      if (!isNaN(d.getTime())) retired.set(monthKey(d), (retired.get(monthKey(d)) ?? 0) + 1);
    }
  }

  // Cap "All" at 5 years so the chart stays readable.
  const floor = new Date(now.getFullYear(), now.getMonth() - 59, 1);
  if (earliest < floor) earliest = floor;

  const series: MovementPoint[] = [];
  const cursor = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  while (cursor <= end) {
    const key = monthKey(cursor);
    series.push({
      key,
      label: cursor.toLocaleString('en-US', { month: 'short' }),
      added: added.get(key) ?? 0,
      retired: retired.get(key) ?? 0,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return series;
}

// ─── Initial State (empty — everything comes from the API) ────────────────────

const initialState: DashboardState = {
  stats: computeStatsFromAssets([]),
  movement: [],
  movementRange: 'All',
  activity: [],
  isLoading: false,
  analyticsLoading: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      if (!isSupabaseConfigured()) return computeStatsFromAssets([]);
      const { data, error } = await supabase.from('assets').select('*');
      if (error) throw error;
      return computeStatsFromAssets(data ?? []);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

/** Added vs retired per month, built from assets.created_at / updated_at + status. */
export const fetchAssetMovement = createAsyncThunk(
  'dashboard/fetchAssetMovement',
  async (_, { rejectWithValue }) => {
    try {
      if (!isSupabaseConfigured()) return [] as MovementPoint[];
      
      const { data: assetsData, error: assetsErr } = await supabase.from('assets').select('created_at');
      if (assetsErr) throw assetsErr;

      const { data: retiredData, error: retiredErr } = await supabase.from('asset_history')
        .select('event_date')
        .in('event_type', ['Retired', 'Lost']);
      if (retiredErr) throw retiredErr;

      const rows = [
        ...(assetsData ?? []).map((a) => ({ created_at: a.created_at, status: 'Active' })),
        ...(retiredData ?? []).map((r) => ({ updated_at: r.event_date, status: 'Retired' })),
      ];

      return buildMovementSeries(rows);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

/** Latest assignments + work orders merged into one feed. */
export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      if (!isSupabaseConfigured()) return [] as ActivityItem[];

      const [assignRes, woRes] = await Promise.allSettled([
        supabase
          .from('asset_assignments')
          .select('id, assigned_date, asset:assets(name), employee:employees(name)')
          .order('assigned_date', { ascending: false })
          .limit(6),
        supabase
          .from('v_work_orders')
          .select('id, asset_name, technician_name, type, status, date')
          .in('status', ['In Progress', 'Completed', 'Overdue'])
          .order('date', { ascending: false })
          .limit(6),
      ]);

      const items: ActivityItem[] = [];

      if (assignRes.status === 'fulfilled' && !assignRes.value.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const row of (assignRes.value.data ?? []) as any[]) {
          const asset = Array.isArray(row.asset) ? row.asset[0] : row.asset;
          const emp = Array.isArray(row.employee) ? row.employee[0] : row.employee;
          if (!asset?.name || !emp?.name) continue;
          items.push({
            id: `asg-${row.id}`,
            actor: emp.name,
            action: 'received',
            target: asset.name,
            date: row.assigned_date,
          });
        }
      }

      if (woRes.status === 'fulfilled' && !woRes.value.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const row of (woRes.value.data ?? []) as any[]) {
          const type = String(row.type ?? 'maintenance').toLowerCase();
          const action =
            row.status === 'In Progress'
              ? 'started maintenance on'
              : row.status === 'Completed'
                ? `completed ${type} on`
                : `has overdue ${type} on`;
          items.push({
            id: `wo-${row.id}`,
            actor: row.technician_name ?? 'Unassigned',
            action,
            target: row.asset_name,
            date: row.date,
          });
        }
      }

      return items
        .filter((i) => i.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardStats(state, action: PayloadAction<Record<string, DashboardStatData>>) {
      state.stats = action.payload;
    },
    updateDashboardStat(state, action: PayloadAction<DashboardStatData>) {
      if (state.stats[action.payload.id]) {
        state.stats[action.payload.id] = { ...state.stats[action.payload.id], ...action.payload };
      }
    },
    movementRangeChanged(state, action: PayloadAction<MovementRange>) {
      state.movementRange = action.payload;
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
      .addCase(fetchAssetMovement.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(fetchAssetMovement.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.movement = action.payload;
      })
      .addCase(fetchAssetMovement.rejected, (state) => {
        state.analyticsLoading = false;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.activity = action.payload;
      });
  },
});

export const { setDashboardStats, updateDashboardStat, movementRangeChanged } = dashboardSlice.actions;

export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.stats;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;
export const selectMovement = (state: { dashboard: DashboardState }) => state.dashboard.movement;
export const selectMovementRange = (state: { dashboard: DashboardState }) => state.dashboard.movementRange;
export const selectAnalyticsLoading = (state: { dashboard: DashboardState }) => state.dashboard.analyticsLoading;
export const selectRecentActivity = (state: { dashboard: DashboardState }) => state.dashboard.activity;

export default dashboardSlice.reducer;
