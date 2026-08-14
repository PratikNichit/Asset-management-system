import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AppSidebar from './components/AppSidebar';
import AppTopBar from './components/AppTopBar';
import StatCard from './components/StatCard';
import QuickActions from './components/QuickActions';

// ─── Mock stat card data ──────────────────────────────────────────────────────

const STATS = [
  {
    label: 'Total assets',
    value: '2,148',
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 16, color: '#5159D7' }} />,
    iconBgColor: '#5159D71A',
    trendValue: '4.2%',
    trendDirection: 'up' as const,
    trendLabel: 'vs last month',
  },
  {
    label: 'Assigned',
    value: '1,684',
    icon: <AssignmentIndOutlinedIcon sx={{ fontSize: 16, color: '#20B46B' }} />,
    iconBgColor: '#20B46B26',
    trendValue: '2.1%',
    trendDirection: 'up' as const,
    trendLabel: 'vs last month',
  },
  {
    label: 'Available',
    value: '342',
    icon: <GroupsOutlinedIcon sx={{ fontSize: 16, color: '#009BD8' }} />,
    iconBgColor: '#009BD826',
    trendValue: '1.4%',
    trendDirection: 'down' as const,
    trendLabel: 'vs last month',
  },
  {
    label: 'Under maintenance',
    value: '86',
    icon: <BuildOutlinedIcon sx={{ fontSize: 16, color: '#EFA831' }} />,
    iconBgColor: '#EFA83133',
    trendValue: '1.2%',
    trendDirection: 'up' as const,
    trendLabel: 'vs last month',
  },
  {
    label: 'Warranty expiring',
    value: '7',
    icon: <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: '#E62C2C' }} />,
    iconBgColor: '#E62C2C26',
    note: 'next 90 days',
  },
  {
    label: 'Retired YTD',
    value: '36',
    icon: <ArchiveOutlinedIcon sx={{ fontSize: 16, color: '#321C00' }} />,
    iconBgColor: '#321C0026',
  },
];

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <AppSidebar activeItem="dashboard" />

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <AppTopBar
          breadcrumbs={['Atlas Industries', 'Asset Management']}
          onNewAsset={() => alert('New asset clicked')}
        />

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>

          {/* ── Page header ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box>
                <Box component="h1" sx={{ m: 0, fontFamily: '"Manrope", sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'text.primary', lineHeight: 1.3 }}>
                  Good morning, Priya
                </Box>
                <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: '0.9375rem', color: theme.palette.primary.main, fontWeight: 400 }}>
                  {"Here's what's happening across Atlas Industries today."}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box component="button" sx={{ px: 2, py: 0.75, borderRadius: 2, border: `1px solid ${theme.palette.customColors.borderLight}`, bgcolor: 'transparent', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', color: 'text.primary', '&:hover': { bgcolor: theme.palette.customColors.bgNeutral } }}>
                  View reports
                </Box>
                <Box component="button" sx={{ px: 2, py: 0.75, borderRadius: 2, border: 'none', bgcolor: theme.palette.primary.main, fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { bgcolor: theme.palette.primary.dark } }}>
                  + New asset
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Stat cards row ──────────────────────────────────────────── */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 2,
              mb: 3,
            }}
          >
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </Box>

          {/* ── Bottom row ──────────────────────────────────────────────── */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 2.5 }}>

            {/* Chart placeholder */}
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
                  <Box sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 600, fontSize: '0.9375rem' }}>Asset movement</Box>
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>Added vs retired, last 7 months</Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {['7M', '1Y', 'All'].map((t) => (
                    <Box key={t} component="button" sx={{ px: 1.25, py: 0.25, borderRadius: 1, border: 'none', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', bgcolor: t === '7M' ? theme.palette.primary.main : 'transparent', color: t === '7M' ? '#fff' : 'text.secondary', '&:hover': { bgcolor: t === '7M' ? theme.palette.primary.main : theme.palette.customColors.bgNeutral } }}>
                      {t}
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* Chart area placeholder */}
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, bgcolor: theme.palette.customColors.bgLight, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <Box sx={{ fontSize: '2rem', mb: 0.5 }}>📈</Box>
                  <Box sx={{ fontSize: '0.75rem' }}>Chart coming soon (install recharts)</Box>
                </Box>
              </Box>
            </Box>

            {/* Quick Actions */}
            <QuickActions />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
