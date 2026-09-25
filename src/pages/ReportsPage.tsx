import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLayout } from '../hooks/useLayout';
import StatCard from '../components/StatCard';
import MaintenanceReportTab from '../components/MaintenanceReportTab';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { SxProps, Theme } from '@mui/material/styles';
import type { RootState } from '../app/store';
import { selectAllAssets } from '../redux/assetsSlice';
import { selectAllWorkOrders } from '../redux/maintenanceSlice';

export interface ReportsPageProps {
  organizationName?: string;
}

const CHART_COLORS = ['#5159D7', '#2E7D32', '#D68A1F', '#0288D1', '#C2410C', '#7C3AED', '#DB2777'];

function fmtRupee(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}
function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function monthLabel(key: string) {
  return new Date(`${key}-01`).toLocaleString('en-US', { month: 'short' });
}
function daysUntil(dateStr: string | null | undefined) {
  if (!dateStr) return Infinity;
  return Math.ceil((+new Date(dateStr) - Date.now()) / 86400000);
}
function countBy<T>(items: T[], key: (item: T) => string) {
  const m = new Map<string, number>();
  items.forEach((item) => { const k = key(item) || 'Unassigned'; m.set(k, (m.get(k) ?? 0) + 1); });
  return [...m.entries()].map(([name, value]) => ({ name, value }));
}

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
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const assets = useSelector((s: RootState) => selectAllAssets(s));
  const workOrders = useSelector(selectAllWorkOrders);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Reports' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

  /* ---- KPIs ---- */
  const totalAssets = assets.length;
  const totalValue = useMemo(() => assets.reduce((s, a) => s + (a.purchaseCost ?? 0), 0), [assets]);
  const warrantyAtRisk = useMemo(() => assets.filter((a) => daysUntil(a.warrantyExpiry) <= 90).length, [assets]);
  const inUseCount = useMemo(() => assets.filter((a) => a.status === 'In Use').length, [assets]);
  const utilization = totalAssets ? Math.round((inUseCount / totalAssets) * 100) : 0;

  const capExData = useMemo(() => {
    const capex = new Map<string, number>();
    const opex = new Map<string, number>();
    assets.forEach((a) => { if (a.purchaseDate && a.purchaseCost) { const k = monthKey(a.purchaseDate); capex.set(k, (capex.get(k) ?? 0) + a.purchaseCost); } });
    workOrders.forEach((wo) => { const k = monthKey(wo.date); opex.set(k, (opex.get(k) ?? 0) + wo.costUsd); });
    const keys = [...new Set([...capex.keys(), ...opex.keys()])].sort();
    return keys.map((k) => ({ name: monthLabel(k), capex: capex.get(k) ?? 0, opex: opex.get(k) ?? 0 }));
  }, [assets, workOrders]);

  const statusData = useMemo(() => countBy(assets, (a) => a.status), [assets]);
  const categoryData = useMemo(() => countBy(assets, (a) => a.category), [assets]);
  const departmentData = useMemo(() => countBy(assets, (a) => a.department), [assets]);

  /* ---- Export current tab's content to a paginated PDF ---- */
  const handleExportPdf = async () => {
    if (!reportRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: theme.palette.background.paper,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Header
      pdf.setFontSize(14);
      pdf.text(organizationName, margin, position);
      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text(
        `${activeTab === 0 ? 'Overview' : 'Maintenance'} report — ${new Date().toLocaleDateString('en-IN')}`,
        margin,
        position + 5
      );
      position += 12;
      heightLeft -= (pageHeight - position - margin);

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);

      // Add extra pages if content overflows one page
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= usableHeight;
      }

      const filename = `${organizationName.replace(/\s+/g, '-')}-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
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
          onClick={handleExportPdf}
          disabled={isExporting}
          startIcon={isExporting ? <CircularProgress size={16} /> : <FileDownloadOutlinedIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.primary',
            borderColor: 'customColors.borderLight',
            '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' },
          }}
        >
          {isExporting ? 'Exporting…' : 'Export PDF'}
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

      {/* ── Exportable content wrapper ─────────────────────────────────── */}
      <Box ref={reportRef}>
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* ── Stat cards ──────────────────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
              <StatCard
                label="Total assets"
                value={String(totalAssets)}
                icon={<Inventory2OutlinedIcon style={{ color: CHART_COLORS[0] }} />}
                iconBgColor={`${CHART_COLORS[0]}1A`}
              />
              <StatCard
                label="Total value"
                value={fmtRupee(totalValue)}
                icon={<CurrencyRupeeOutlinedIcon style={{ color: CHART_COLORS[1] }} />}
                iconBgColor={`${CHART_COLORS[1]}1A`}
                note="sum of purchase cost"
              />
              <StatCard
                label="Warranty at risk"
                value={String(warrantyAtRisk)}
                icon={<WarningAmberOutlinedIcon style={{ color: '#D32F2F' }} />}
                iconBgColor="#D32F2F1A"
                note="expiring in 90d"
              />
              <StatCard
                label="Utilization"
                value={`${utilization}%`}
                icon={<TimelineOutlinedIcon style={{ color: CHART_COLORS[3] }} />}
                iconBgColor={`${CHART_COLORS[3]}1A`}
                note="assets in use"
              />
            </Box>

            {/* ── Charts ──────────────────────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <Paper variant="outlined" sx={cardSx}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  CapEx vs OpEx
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: -1.5, mb: 1.5 }}>
                  Purchases vs maintenance spend, by month
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={capExData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartChrome.grid} />
                    <XAxis dataKey="name" stroke={chartChrome.axis} tick={{ fontSize: 12 }} />
                    <YAxis stroke={chartChrome.axis} tick={{ fontSize: 12 }} width={45} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtRupee(Number(v))} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="capex" name="CapEx" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="opex" name="OpEx" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              <Paper variant="outlined" sx={cardSx}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  Assets by status
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartChrome.grid} />
                    <XAxis dataKey="name" stroke={chartChrome.axis} tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis stroke={chartChrome.axis} tick={{ fontSize: 12 }} width={35} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
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
                    <XAxis type="number" stroke={chartChrome.axis} tick={{ fontSize: 12 }} allowDecimals={false} />
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
    </Box>
  );
}