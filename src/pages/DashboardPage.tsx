import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import { useLayout } from '../hooks/useLayout';
import { getGreeting } from '../utils/greeting';
import { useAppSelector } from '../app/hooks';
import { selectDashboardStats } from '../redux/dashboardSlice';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DashboardPageProps {
  userName?: string;
  organizationName?: string;
  onNewAssetClick?: () => void;
}

/**
 * DashboardPage — Route container component for main asset management overview.
 */
export default function DashboardPage({
  userName = 'Pratik',
  organizationName = 'Atlas Industries',
  onNewAssetClick,
}: DashboardPageProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setBreadcrumbLinks } = useLayout();
  const greeting = getGreeting();
  const statsData = useAppSelector(selectDashboardStats);

  const handleNewAsset = () => {
    if (onNewAssetClick) onNewAssetClick();
    else navigate('/assets/new');
  };

  const dashboardStats = useMemo(() => {
    return [
      {
        label: 'Total assets',
        icon: <Inventory2OutlinedIcon sx={{ fontSize: 16, color: theme.palette.mode === 'dark' ? '#818CF8' : '#5159D7' }} />,
        iconBgColor: theme.palette.customColors.primaryTransparent,
        ...statsData.total_assets,
      },
      {
        label: 'Assigned',
        icon: <AssignmentIndOutlinedIcon sx={{ fontSize: 16, color: theme.palette.mode === 'dark' ? '#34D399' : '#20B46B' }} />,
        iconBgColor: theme.palette.customColors.successTransparent,
        ...statsData.assigned,
      },
      {
        label: 'Available',
        icon: <GroupsOutlinedIcon sx={{ fontSize: 16, color: theme.palette.mode === 'dark' ? '#38BDF8' : '#009BD8' }} />,
        iconBgColor: theme.palette.customColors.infoTransparent,
        ...statsData.available,
      },
      {
        label: 'Under maintenance',
        icon: <BuildOutlinedIcon sx={{ fontSize: 16, color: theme.palette.mode === 'dark' ? '#FBBF24' : '#EFA831' }} />,
        iconBgColor: theme.palette.customColors.warningTransparent,
        ...statsData.under_maintenance,
      },
      {
        label: 'Warranty expiring',
        icon: <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: theme.palette.mode === 'dark' ? '#F87171' : '#E62C2C' }} />,
        iconBgColor: theme.palette.customColors.errorTransparent,
        ...statsData.warranty_expiring,
      },
      {
        label: 'Retired YTD',
        icon: <ArchiveOutlinedIcon sx={{ fontSize: 16, color: theme.palette.mode === 'dark' ? '#94A3B8' : '#321C00' }} />,
        iconBgColor: theme.palette.customColors.bgNeutralTransparent1,
        ...statsData.retired_ytd,
      },
    ];
  }, [statsData, theme.palette.mode, theme.palette.customColors]);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Dashboard' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  return (
    <Box>
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box>
            <Box
              component="h1"
              sx={{
                m: 0,
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 700,
                fontSize: '1.75rem',
                color: 'text.primary',
                lineHeight: 1.3,
              }}
            >
              {greeting}, {userName}
            </Box>
            <Box
              component="p"
              sx={{
                m: 0,
                mt: 0.5,
                fontSize: '0.9375rem',
                color: theme.palette.primary.main,
                fontWeight: 400,
              }}
            >
              {`Here's what's happening across ${organizationName} today.`}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              component="button"
              sx={{
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
              }}
            >
              View reports
            </Box>
            <Box
              component="button"
              onClick={handleNewAsset}
              sx={{
                px: 2,
                py: 0.75,
                borderRadius: 2,
                border: 'none',
                bgcolor: theme.palette.primary.main,
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { bgcolor: theme.palette.primary.dark },
              }}
            >
              + New asset
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Stat Cards Grid ───────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 2,
          mb: 3,
        }}
      >
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </Box>

      {/* ── Bottom Section: Analytics & Quick Actions ──────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 2.5 }}>
        {/* Asset Movement Chart Card */}
        <Box
          sx={{
            borderRadius: 2.5,
            border: `1px solid ${theme.palette.customColors.borderLight}`,
            bgcolor: theme.palette.customColors.white,
            p: 2.5,
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box>
              <Box sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 600, fontSize: '0.9375rem' }}>
                Asset movement
              </Box>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
                Added vs retired, last 7 months
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {['7M', '1Y', 'All'].map((t) => (
                <Box
                  key={t}
                  component="button"
                  sx={{
                    px: 1.25,
                    py: 0.25,
                    borderRadius: 1,
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    bgcolor: t === '7M' ? theme.palette.primary.main : 'transparent',
                    color: t === '7M' ? '#fff' : 'text.secondary',
                    '&:hover': {
                      bgcolor: t === '7M' ? theme.palette.primary.main : theme.palette.customColors.bgNeutral,
                    },
                  }}
                >
                  {t}
                </Box>
              ))}
            </Box>
          </Box>
          {/* Chart area placeholder */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 2,
              bgcolor: theme.palette.customColors.bgLight,
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
              <Box sx={{ fontSize: '2rem', mb: 0.5 }}>📈</Box>
              <Box sx={{ fontSize: '0.75rem' }}>Chart coming soon (install recharts)</Box>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions Component */}
        <QuickActions />
      </Box>
    </Box>
  );
}
