import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import { useLayout } from '../hooks/useLayout';
import StatCard from '../components/StatCard';
import MaintenanceReportTab from '../components/MaintenanceReportTab';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ReportsPageProps {
  organizationName?: string;
}

const capExData = [
  { name: 'Jan', capex: 12000, opex: 3000 },
  { name: 'Feb', capex: 8000, opex: 2800 },
  { name: 'Mar', capex: 16000, opex: 3200 },
  { name: 'Apr', capex: 7000, opex: 2500 },
  { name: 'May', capex: 21000, opex: 4500 },
  { name: 'Jun', capex: 9000, opex: 4000 },
  { name: 'Jul', capex: 11000, opex: 4200 },
];

const addedRetiredData = [
  { name: 'Jan', added: 24, retired: 5 },
  { name: 'Feb', added: 31, retired: 7 },
  { name: 'Mar', added: 42, retired: 11 },
  { name: 'Apr', added: 28, retired: 3 },
  { name: 'May', added: 52, retired: 10 },
  { name: 'Jun', added: 46, retired: 11 },
  { name: 'Jul', added: 38, retired: 6 },
];

const categoryData = [
  { name: 'Laptops', value: 400 },
  { name: 'Monitors', value: 300 },
  { name: 'Machines', value: 200 },
  { name: 'Molds', value: 100 },
  { name: 'Forklifts', value: 50 },
  { name: 'Peripherals', value: 150 },
];

const departmentData = [
  { name: 'Maintenance', value: 60 },
  { name: 'Quality', value: 35 },
  { name: 'Production', value: 210 },
  { name: 'Operations', value: 85 },
  { name: 'Design', value: 40 },
  { name: 'Engineering', value: 140 },
];

// One categorical palette used everywhere a series needs a distinct color —
// keeps CapEx/OpEx, category and department charts visually consistent.
const CHART_COLORS = ['#5159D7', '#2E7D32', '#D68A1F', '#0288D1', '#C2410C', '#7C3AED'];

// ── Shared style helpers ─────────────────────────────────────────────────

const cardSx: SxProps<Theme> = {
  p: 3,
  borderRadius: 3,
  borderColor: 'customColors.borderLight',
  bgcolor: 'background.paper',
  height: 360,
  display: 'flex',
  flexDirection: 'column',
};

function tabSx(theme: Theme, selected: boolean): SxProps<Theme> {
  return {
    minHeight: 36,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: selected ? theme.palette.getContrastText(theme.palette.text.primary) : 'text.secondary',
    bgcolor: selected ? 'text.primary' : 'transparent',
    '&:hover': { bgcolor: selected ? 'text.primary' : 'action.hover' },
    '&.Mui-selected': { color: theme.palette.background.paper },
  };
}

export default function ReportsPage({ organizationName = 'Atlas Industries' }: ReportsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Reports' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Chart chrome (gridlines, axis text, tooltip) pulled from the active theme
  // instead of hardcoded hex, so charts stay legible in light and dark mode.
  const chartChrome = useMemo(
    () => ({
      grid: theme.palette.divider,
      axis: theme.palette.text.secondary,
      tooltipBg: theme.palette.background.paper,
      tooltipBorder: theme.palette.customColors?.borderLight ?? theme.palette.divider,
    }),
    [theme]
  );

  const tooltipStyle = {
    backgroundColor: chartChrome.tooltipBg,
    borderColor: chartChrome.tooltipBorder,
    borderRadius: 8,
    fontSize: 13,
  };

  return (
    <Box>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Portfolio, health and financial insights across your workspace.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.primary',
            borderColor: 'customColors.borderLight',
            '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' },
          }}
        >
          Export PDF
        </Button>
      </Box>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 36,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: 1 },
          }}
        >
          <Tab label="Overview" disableRipple sx={tabSx(theme, activeTab === 0)} />
          <Tab label="Maintenance report" disableRipple sx={tabSx(theme, activeTab === 1)} />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* ── Stat cards ──────────────────────────────────────────────── */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
            <StatCard
              label="Total assets"
              value="2,148"
              icon={<Inventory2OutlinedIcon style={{ color: CHART_COLORS[0] }} />}
              iconBgColor={`${CHART_COLORS[0]}1A`}
              trendValue="4.2%"
              trendDirection="up"
            />
            <StatCard
              label="Total value"
              value="$1.24M"
              icon={<AttachMoneyOutlinedIcon style={{ color: CHART_COLORS[1] }} />}
              iconBgColor={`${CHART_COLORS[1]}1A`}
              trendValue="2.8%"
              trendDirection="up"
            />
            <StatCard
              label="Warranty at risk"
              value="18"
              icon={<WarningAmberOutlinedIcon style={{ color: '#D32F2F' }} />}
              iconBgColor="#D32F2F1A"
              note="expiring in 90d"
            />
            <StatCard
              label="Utilization"
              value="78%"
              icon={<TimelineOutlinedIcon style={{ color: CHART_COLORS[3] }} />}
              iconBgColor={`${CHART_COLORS[3]}1A`}
              trendValue="1.2%"
              trendDirection="up"
            />
          </Box>

          {/* ── Charts ──────────────────────────────────────────────────── */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <Paper variant="outlined" sx={cardSx}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                CapEx vs OpEx
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={capExData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartChrome.grid} />
                  <XAxis dataKey="name" stroke={chartChrome.axis} tick={{ fontSize: 12 }} />
                  <YAxis stroke={chartChrome.axis} tick={{ fontSize: 12 }} width={45} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="capex" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="opex" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            <Paper variant="outlined" sx={cardSx}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                Assets added vs retired
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={addedRetiredData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartChrome.grid} />
                  <XAxis dataKey="name" stroke={chartChrome.axis} tick={{ fontSize: 12 }} />
                  <YAxis stroke={chartChrome.axis} tick={{ fontSize: 12 }} width={35} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="added" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="retired" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            <Paper variant="outlined" sx={cardSx}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                By category
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>

            <Paper variant="outlined" sx={cardSx}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                By department
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 24, left: 8, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartChrome.grid} />
                  <XAxis type="number" stroke={chartChrome.axis} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke={chartChrome.axis} tick={{ fontSize: 12 }} width={90} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
      )}

      {activeTab === 1 && <MaintenanceReportTab />}
    </Box>
  );
}