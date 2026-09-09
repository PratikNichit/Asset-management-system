import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DashboardStatData {
  id: string;
  value: string | number;
  trendValue?: string;
  trendDirection?: 'up' | 'down';
  trendLabel?: string;
  note?: string;
}

interface DashboardState {
  stats: Record<string, DashboardStatData>;
}

const initialState: DashboardState = {
  stats: {
    'total_assets': {
      id: 'total_assets',
      value: '2,148',
      trendValue: '4.2%',
      trendDirection: 'up',
      trendLabel: 'vs last month',
    },
    'assigned': {
      id: 'assigned',
      value: '1,684',
      trendValue: '2.1%',
      trendDirection: 'up',
      trendLabel: 'vs last month',
    },
    'available': {
      id: 'available',
      value: '342',
      trendValue: '1.4%',
      trendDirection: 'down',
      trendLabel: 'vs last month',
    },
    'under_maintenance': {
      id: 'under_maintenance',
      value: '86',
      trendValue: '1.2%',
      trendDirection: 'up',
      trendLabel: 'vs last month',
    },
    'warranty_expiring': {
      id: 'warranty_expiring',
      value: '7',
      note: 'next 90 days',
    },
    'retired_ytd': {
      id: 'retired_ytd',
      value: '36',
    }
  }
};

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
          ...action.payload
        };
      }
    }
  },
});

export const { setDashboardStats, updateDashboardStat } = dashboardSlice.actions;

export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.stats;

export default dashboardSlice.reducer;
