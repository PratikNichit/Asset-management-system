import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import {
  AssetMovementChart,
  CategoryDonut,
  DepartmentBars,
  type CountDatum,
} from '../components/DashboardCharts';
import { RecentActivity, RecentAssetsTable } from '../components/DashboardLists';
import { useLayout } from '../hooks/useLayout';
import { getGreeting } from '../utils/greeting';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchAssets, selectAllAssets } from '../redux/assetsSlice';
import {
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
  selectMovement,
  selectMovementRange,
  selectAnalyticsLoading,
  selectRecentActivity,
  fetchDashboardStats,
  fetchAssetMovement,
  fetchRecentActivity,
  movementRangeChanged,
  type MovementRange,
} from '../redux/dashboardSlice';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DashboardPageProps {
  userName?: string;
  organizationName?: string;
  onNewAssetClick?: () => void;
}

// Group assets by a string field → sorted [{name, value}] (largest first).
function countBy<T extends Record<string, any>>(items: T[], field: keyof T, fallback: string, limit?: number): CountDatum[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = (item[field] as string | null | undefined)?.trim() || fallback;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const sorted = [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  if (limit && sorted.length > limit) {
    const rest = sorted.slice(limit - 1).reduce((s, d) => s + d.value, 0);
    return [...sorted.slice(0, limit - 1), { name: 'Other', value: rest }];
  }
  return sorted;
}

/**
 * DashboardPage — overview of the asset estate. Every number, chart and list
 * here is derived from Redux state that is populated from Supabase.
 */
export default function DashboardPage({
  userName: propUserName,
  organizationName = 'Atlas Industries',
  onNewAssetClick,
}: DashboardPageProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { setBreadcrumbLinks } = useLayout();
  const greeting = getGreeting();

  const authUser = useAppSelector((state) => state.auth.user);
  const userName = propUserName || authUser?.name || 'there';

  const statsData = useAppSelector(selectDashboardStats);
  const statsLoading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  const movement = useAppSelector(selectMovement);
  const movementRange = useAppSelector(selectMovementRange);
  const analyticsLoading = useAppSelector(selectAnalyticsLoading);
  const activity = useAppSelector(selectRecentActivity);
  const assets = useAppSelector(selectAllAssets);
  const assetsLoading = useAppSelector((state) => state.assets.isLoading);

  const isLoading = statsLoading || analyticsLoading || assetsLoading;

  const loadAll = useCallback(() => {
    dispatch(fetchAssets());
    dispatch(fetchDashboardStats());
    dispatch(fetchAssetMovement());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Dashboard' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const handleNewAsset = useCallback(() => {
    if (onNewAssetClick) onNewAssetClick();
    else navigate('/assets/new');
  }, [onNewAssetClick, navigate]);

  // ── Derived chart data (real assets from Redux) ────────────────────────────
  const visibleMovement = useMemo(() => {
    if (movementRange === '7M') return movement.slice(-7);
    if (movementRange === '1Y') return movement.slice(-12);
    return movement;
  }, [movement, movementRange]);

  const categoryData = useMemo(() => countBy(assets, 'category', 'Uncategorized', 8), [assets]);
  const departmentData = useMemo(() => countBy(assets, 'department', 'Unassigned dept', 8), [assets]);
  const recentAssets = useMemo(() => assets.slice(0, 5), [assets]);

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const dark = theme.palette.mode === 'dark';
  const dashboardStats = useMemo(
    () => [
      {
        label: 'Total assets',
        icon: <Inventory2OutlinedIcon sx={{ fontSize: 16, color: dark ? '#818CF8' : '#5159D7' }} />,
        iconBgColor: theme.palette.customColors.primaryTransparent,
        isLoading: statsLoading,
        ...statsData.total_assets,
      },
      {
        label: 'Assigned',
        icon: <AssignmentIndOutlinedIcon sx={{ fontSize: 16, color: dark ? '#34D399' : '#20B46B' }} />,
        iconBgColor: theme.palette.customColors.successTransparent,
        isLoading: statsLoading,
        ...statsData.assigned,
      },
      {
        label: 'Available',
        icon: <GroupsOutlinedIcon sx={{ fontSize: 16, color: dark ? '#38BDF8' : '#009BD8' }} />,
        iconBgColor: theme.palette.customColors.infoTransparent,
        isLoading: statsLoading,
        ...statsData.available,
      },
      {
        label: 'Under maintenance',
        icon: <BuildOutlinedIcon sx={{ fontSize: 16, color: dark ? '#FBBF24' : '#EFA831' }} />,
        iconBgColor: theme.palette.customColors.warningTransparent,
        isLoading: statsLoading,
        ...statsData.under_maintenance,
      },
      {
        label: 'Warranty expiring',
        icon: <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: dark ? '#F87171' : '#E62C2C' }} />,
        iconBgColor: theme.palette.customColors.errorTransparent,
        isLoading: statsLoading,
        ...statsData.warranty_expiring,
      },
      {
        label: 'Retired YTD',
        icon: <ArchiveOutlinedIcon sx={{ fontSize: 16, color: dark ? '#94A3B8' : '#321C00' }} />,
        iconBgColor: theme.palette.customColors.bgNeutralTransparent1,
        isLoading: statsLoading,
        ...statsData.retired_ytd,
      },
    ],
    [statsData, statsLoading, dark, theme.palette.customColors],
  );

  const quickActionsList = useMemo(
    () => [
      { id: 'add-asset', label: 'Add new asset', icon: <AddCircleOutlinedIcon fontSize="small" />, onClick: () => navigate('/assets/new') },
      { id: 'assign', label: 'Assign to employee', icon: <AssignmentIndOutlinedIcon fontSize="small" />, onClick: () => navigate('/assign-asset') },
      { id: 'maintenance', label: 'Schedule maintenance', icon: <BuildOutlinedIcon fontSize="small" />, onClick: () => navigate('/maintenance/schedule') },
      { id: 'qr', label: 'Generate QR labels', icon: <QrCodeOutlinedIcon fontSize="small" />, onClick: () => navigate('/assets') },
      { id: 'reports', label: 'Open reports', icon: <BarChartOutlinedIcon fontSize="small" />, onClick: () => navigate('/reports') },
    ],
    [navigate],
  );

  const outlineBtn = {
    px: 2,
    py: 0.75,
    borderRadius: 2,
    border: `1px solid ${theme.palette.customColors.borderLight}`,
    bgcolor: 'transparent',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    color: 'text.primary',
    '&:hover': { bgcolor: theme.palette.customColors.bgNeutral },
  } as const;

  return (
    <Box sx={{ '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }}>
      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 2.5, borderRadius: 2 }}
          action={<Button color="inherit" size="small" onClick={loadAll}>Retry</Button>}
        >
          {error}
        </Alert>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box
            component="h1"
            sx={{ m: 0, fontFamily: '"Manrope", sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'text.primary', lineHeight: 1.3 }}
          >
            {greeting}, {userName}
          </Box>
          <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: '0.9375rem', color: theme.palette.primary.main }}>
            {`Here's what's happening across ${organizationName} today.`}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            component="button"
            onClick={loadAll}
            disabled={isLoading}
            title="Refresh dashboard"
            sx={{ ...outlineBtn, px: 1.25, display: 'flex', alignItems: 'center', gap: 0.5, opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'default' : 'pointer' }}
          >
            <RefreshOutlinedIcon sx={{ fontSize: 18, animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </Box>
          <Box component="button" onClick={() => navigate('/reports')} sx={outlineBtn}>
            View reports
          </Box>
          <Box
            component="button"
            onClick={handleNewAsset}
            sx={{ px: 2, py: 0.75, borderRadius: 2, border: 'none', bgcolor: theme.palette.primary.main, fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', color: '#fff', '&:hover': { bgcolor: theme.palette.primary.dark } }}
          >
            + New asset
          </Box>
        </Box>
      </Box>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, mb: 3 }}>
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </Box>

      {/* ── Movement + category distribution ───────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 2.5, mb: 2.5 }}>
        <AssetMovementChart
          data={visibleMovement}
          range={movementRange}
          onRangeChange={(r: MovementRange) => dispatch(movementRangeChanged(r))}
          loading={analyticsLoading}
        />
        <CategoryDonut data={categoryData} loading={assetsLoading} />
      </Box>

      {/* ── Department bars + quick actions ────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 2.5, mb: 2.5 }}>
        <DepartmentBars data={departmentData} loading={assetsLoading} onDetails={() => navigate('/departments')} />
        <QuickActions actions={quickActionsList} />
      </Box>

      {/* ── Recent activity ────────────────────────────────────────────────── */}
      <Box sx={{ mb: 2.5 }}>
        <RecentActivity items={activity} loading={analyticsLoading} />
      </Box>

      {/* ── Recently added assets ──────────────────────────────────────────── */}
      <RecentAssetsTable assets={recentAssets} loading={assetsLoading} onViewAll={() => navigate('/assets')} />
    </Box>
  );
}
