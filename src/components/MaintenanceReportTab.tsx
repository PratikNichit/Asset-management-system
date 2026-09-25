import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme, alpha } from '@mui/material/styles';
import StatCard from './StatCard';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { RootState } from '../app/store';
import { selectAllWorkOrders, type WorkOrder, type WorkOrderType, type WorkOrderStatus } from '../redux/maintenanceSlice';
import { selectAllAssets } from '../redux/assetsSlice';
import type { Asset } from '../types/asset';

/* ------------------------------------------------------------------ */
/* Real-data helpers                                                   */
/* ------------------------------------------------------------------ */

const TYPE_COLORS: Record<WorkOrderType, string> = {
  Calibration: '#5159D7',
  Repair: '#4CAF50',
  Inspection: '#FFC107',
  Preventive: '#03A9F4',
};

const STATUS_COLORS: Record<WorkOrderStatus, string> = {
  Completed: '#4CAF50',
  'In Progress': '#03A9F4',
  Scheduled: '#FF9800',
  Overdue: '#F44336',
};

const REPAIR_STATUS: Record<'Maintenance' | 'Under Maintenance', true> = {
  Maintenance: true,
  'Under Maintenance': true,
};

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', { month: 'short' });
}
function weekKey(dateStr: string) {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((+d - +jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}
function fmtRupee(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}
function topN<T>(entries: [string, T][], n: number, by: (v: T) => number) {
  return [...entries].sort((a, b) => by(b[1]) - by(a[1])).slice(0, n);
}

type BreakdownKey = 'asset' | 'department' | 'category';

/* ------------------------------------------------------------------ */
/* Small layout helpers (same shell as before)                         */
/* ------------------------------------------------------------------ */

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{title}</Typography>
        {description && <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>{description}</Typography>}
      </Box>
      {children}
    </Box>
  );
}

function Panel({ title, subtitle, action, height, children }: { title: string; subtitle?: string; action?: React.ReactNode; height?: number; children: React.ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: 'divider', bgcolor: 'background.paper', height: height ?? '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2, minHeight: 36 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
          {subtitle && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subtitle}</Typography>}
        </Box>
        {action}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}

function SegmentedToggle<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <ToggleButtonGroup exclusive size="small" value={value} onChange={(_, v) => v && onChange(v)}
      sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontSize: '0.75rem', px: 1.25, py: 0.25, borderColor: 'divider' } }}>
      {options.map((o) => <ToggleButton key={o.value} value={o.value}>{o.label}</ToggleButton>)}
    </ToggleButtonGroup>
  );
}

const FilterDropdown = ({ label }: { label: string }) => (
  <Button variant="outlined" color="inherit" endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
    sx={{ color: 'text.secondary', borderColor: 'divider', textTransform: 'none', fontSize: '0.82rem', fontWeight: 400, justifyContent: 'space-between', width: '100%', px: 1.5, py: 0.75, borderRadius: 1.5 }}>
    {label}
  </Button>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function MaintenanceReportTab() {
  const theme = useTheme();
  const workOrders = useSelector(selectAllWorkOrders);
  const assets = useSelector((s: RootState) => selectAllAssets(s));

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [breakdown, setBreakdown] = useState<BreakdownKey>('asset');
  const [mix, setMix] = useState<'type' | 'status'>('type');

  // NOTE: the filter bar below is presentational only — wiring it up to
  // actually filter `workOrders`/`assets` is a follow-up; say the word.

  const assetByCode = useMemo(() => {
    const map = new Map<string, Asset>();
    assets.forEach((a) => map.set(a.code, a));
    return map;
  }, [assets]);

  const deptOf = (wo: WorkOrder) => wo.department ?? assetByCode.get(wo.assetCode)?.department ?? 'Unassigned';
  const catOf = (wo: WorkOrder) => wo.category ?? assetByCode.get(wo.assetCode)?.category ?? 'Unassigned';

  /* ---- KPIs ---- */
  const totalCost = useMemo(() => workOrders.reduce((s, wo) => s + wo.costUsd, 0), [workOrders]);
  const overdueCount = useMemo(() => workOrders.filter((wo) => wo.status === 'Overdue').length, [workOrders]);
  const downtimeValues = useMemo(() => workOrders.map((wo) => wo.downtimeHours).filter((v): v is number => v != null), [workOrders]);
  const avgDowntime = downtimeValues.length ? downtimeValues.reduce((a, b) => a + b, 0) / downtimeValues.length : 0;
  const avgCostPerAsset = assets.length ? totalCost / assets.length : 0;
  const assetsUnderRepair = useMemo(() => assets.filter((a) => (REPAIR_STATUS as any)[a.status]).length, [assets]);
  const completedCount = useMemo(() => workOrders.filter((wo) => wo.status === 'Completed').length, [workOrders]);
  const avgCostPerJob = workOrders.length ? totalCost / workOrders.length : 0;

  /* ---- Monthly cost trend ---- */
  const costTrendData = useMemo(() => {
    const byMonth = new Map<string, number>();
    workOrders.forEach((wo) => byMonth.set(monthKey(wo.date), (byMonth.get(monthKey(wo.date)) ?? 0) + wo.costUsd));
    return [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b))
      .map(([key, cost]) => ({ name: monthLabel(`${key}-01`), cost }));
  }, [workOrders]);

  /* ---- Cost breakdown (asset / department / category) ---- */
  const costBreakdown = useMemo(() => {
    const asset = new Map<string, number>();
    const department = new Map<string, number>();
    const category = new Map<string, number>();
    workOrders.forEach((wo) => {
      asset.set(wo.assetName, (asset.get(wo.assetName) ?? 0) + wo.costUsd);
      const d = deptOf(wo); department.set(d, (department.get(d) ?? 0) + wo.costUsd);
      const c = catOf(wo); category.set(c, (category.get(c) ?? 0) + wo.costUsd);
    });
    const toChart = (m: Map<string, number>) => topN([...m.entries()], 6, (v) => v).map(([name, value]) => ({ name, value }));
    return { asset: toChart(asset), department: toChart(department), category: toChart(category) };
  }, [workOrders, assetByCode]);
  const breakdownColor = { asset: '#5159D7', department: '#4CAF50', category: '#03A9F4' }[breakdown];

  /* ---- Type / status distribution ---- */
  const typeDistributionData = useMemo(() => {
    const counts = new Map<string, number>();
    workOrders.forEach((wo) => counts.set(wo.type, (counts.get(wo.type) ?? 0) + 1));
    const total = workOrders.length || 1;
    return [...counts.entries()].map(([name, count]) => ({ name, value: Math.round((count / total) * 100), color: TYPE_COLORS[name as WorkOrderType] ?? '#94A3B8' }));
  }, [workOrders]);

  const statusData = useMemo(() => {
    const counts = new Map<string, number>();
    workOrders.forEach((wo) => counts.set(wo.status, (counts.get(wo.status) ?? 0) + 1));
    const total = workOrders.length || 1;
    return [...counts.entries()].map(([name, count]) => ({ name, value: Math.round((count / total) * 100), color: STATUS_COLORS[name as WorkOrderStatus] ?? '#94A3B8' }));
  }, [workOrders]);
  const mixData = mix === 'type' ? typeDistributionData : statusData;

  /* ---- Downtime by department ---- */
  const downtimeData = useMemo(() => {
    const m = new Map<string, number>();
    workOrders.forEach((wo) => { if (wo.downtimeHours != null) { const d = deptOf(wo); m.set(d, (m.get(d) ?? 0) + wo.downtimeHours); } });
    return topN([...m.entries()], 6, (v) => v).map(([name, value]) => ({ name, value }));
  }, [workOrders, assetByCode]);

  /* ---- Preventive vs corrective, by week ---- */
  const prevVsCorrData = useMemo(() => {
    const m = new Map<string, { preventive: number; corrective: number }>();
    workOrders.forEach((wo) => {
      const key = weekKey(wo.date);
      const row = m.get(key) ?? { preventive: 0, corrective: 0 };
      if (wo.type === 'Preventive') row.preventive += 1; else if (wo.type === 'Repair') row.corrective += 1;
      m.set(key, row);
    });
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6)
      .map(([_key, v], i) => ({ name: `W${i + 1}`, ...v }));
  }, [workOrders]);

  /* ---- Vendor / technician performance ---- */
  const vendorPerformance = useMemo(() => {
    const m = new Map<string, { jobs: number; cost: number }>();
    workOrders.forEach((wo) => {
      const key = wo.vendor?.trim() || wo.technicianName || 'In-house';
      const row = m.get(key) ?? { jobs: 0, cost: 0 };
      row.jobs += 1; row.cost += wo.costUsd;
      m.set(key, row);
    });
    return topN([...m.entries()], 8, (v) => v.cost).map(([vendor, v]) => ({
      vendor, jobs: v.jobs, cost: fmtRupee(v.cost), avgPerJob: fmtRupee(v.cost / v.jobs),
    }));
  }, [workOrders]);

  /* ---- Most frequently repaired assets ---- */
  const freqRepairedAssets = useMemo(() => {
    const m = new Map<string, { count: number; desc?: string }>();
    workOrders.filter((wo) => wo.type === 'Repair').forEach((wo) => {
      const row = m.get(wo.assetName) ?? { count: 0 };
      row.count += 1; row.desc = wo.description || row.desc;
      m.set(wo.assetName, row);
    });
    return topN([...m.entries()], 4, (v) => v.count).map(([name, v]) => ({ name, events: v.count, desc: v.desc || 'Corrective repairs' }));
  }, [workOrders]);

  /* ---- History (latest jobs) ---- */
  const historyData = useMemo(() => {
    return [...workOrders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((wo) => ({
      id: wo.id, asset: wo.assetName, dept: deptOf(wo), type: wo.type,
      vendor: wo.vendor || wo.technicianName, cost: fmtRupee(wo.costUsd), date: wo.date, status: wo.status,
    }));
  }, [workOrders, assetByCode]);

  /* ---- Chart chrome ---- */
  const gridStroke = theme.palette.divider;
  const axisStroke = theme.palette.text.secondary;
  const axisTick = { fontSize: 12, fill: theme.palette.text.secondary };
  const tooltipStyle = { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#1A1D27', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.8rem', boxShadow: theme.shadows[3] };
  const tooltipItemStyle = { color: '#fff' };
  const tooltipLabelStyle = { color: alpha('#fff', 0.7) };
  const hoverCursor = { fill: alpha(theme.palette.text.primary, 0.04) };

  const tableHeadCellSx = { padding: '10px 12px', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 };
  const tableRowSx = { borderBottom: `1px solid ${theme.palette.divider}`, '&:last-of-type': { borderBottom: 'none' }, '&:hover': { bgcolor: 'action.hover' } };
  const tableCellSx = { padding: '12px', fontSize: '0.85rem', color: 'text.primary' };

  const statusChip = (status: string) => {
    const c = STATUS_COLORS[status as WorkOrderStatus] ?? '#94A3B8';
    return <Chip label={status} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, height: 22, bgcolor: alpha(c, 0.15), color: c }} />;
  };

  const primaryFilters = ['Date range: All time', 'Category: All', 'Department: All', 'Vendor: All'];
  const moreFilters = ['Location: All', 'Maintenance type: All', 'Asset status: All', 'Assignee: All'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

      {/* ── Filters ── */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
          <FilterListOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>Filters</Typography>
          <Button size="small" onClick={() => setShowMoreFilters((s) => !s)} sx={{ textTransform: 'none' }}>
            {showMoreFilters ? 'Fewer filters' : 'More filters'}
          </Button>
          <Button size="small" color="inherit" sx={{ textTransform: 'none', color: 'text.secondary' }}>Reset</Button>
        </Box>
        <Grid container spacing={1.5}>
          {primaryFilters.map((f) => <Grid size={{ xs: 12, sm: 6, md: 3 }} key={f}><FilterDropdown label={f} /></Grid>)}
        </Grid>
        <Collapse in={showMoreFilters}>
          <Grid container spacing={1.5} sx={{ mt: 0 }}>
            {moreFilters.map((f) => <Grid size={{ xs: 12, sm: 6, md: 3 }} key={f}><FilterDropdown label={f} /></Grid>)}
          </Grid>
        </Collapse>
      </Paper>

      {/* ── Overview ── */}
      <Section title="Overview" description="The numbers that need attention first.">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Total maintenance cost" value={fmtRupee(totalCost)} icon={<CurrencyRupeeOutlinedIcon style={{ color: '#5159D7' }} />} iconBgColor="#5159D71A" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Total maintenance tasks" value={String(workOrders.length)} icon={<BuildOutlinedIcon style={{ color: '#03A9F4' }} />} iconBgColor="#03A9F41A" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Overdue maintenance" value={String(overdueCount)} icon={<WarningAmberOutlinedIcon style={{ color: '#FF9800' }} />} iconBgColor="#FF98001A" note="High priority issues" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Average downtime" value={`${avgDowntime.toFixed(1)}h`} icon={<AccessTimeOutlinedIcon style={{ color: '#F44336' }} />} iconBgColor="#F443361A" note="per job" />
          </Grid>
        </Grid>

        <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Grid container>
            {[
              { label: 'Avg cost per asset', value: fmtRupee(avgCostPerAsset) },
              { label: 'Assets under repair', value: String(assetsUnderRepair), note: `out of ${assets.length}` },
              { label: 'Completed jobs', value: `${completedCount} / ${workOrders.length}` },
              { label: 'Avg cost per job', value: fmtRupee(avgCostPerJob) },
            ].map((m, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={m.label} sx={{ p: 2.5, borderLeft: { md: i === 0 ? 'none' : `1px solid ${theme.palette.divider}` }, borderTop: { xs: i > 1 ? `1px solid ${theme.palette.divider}` : 'none', md: 'none' } }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{m.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{m.value}</Typography>
                {m.note && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{m.note}</Typography>}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Section>

      {/* ── Cost ── */}
      <Section title="Where the money goes" description="Spend over time and what drives it.">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Panel title="Monthly maintenance cost" height={360}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costTrendData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={{ stroke: gridStroke }} />
                  <YAxis stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} formatter={(v: any) => fmtRupee(Number(v))} />
                  <Line type="monotone" dataKey="cost" stroke="#5159D7" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Panel title="Cost breakdown" height={360}
              action={<SegmentedToggle<BreakdownKey> value={breakdown} onChange={setBreakdown} options={[{ value: 'asset', label: 'Asset' }, { value: 'department', label: 'Department' }, { value: 'category', label: 'Category' }]} />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBreakdown[breakdown]} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                  <XAxis type="number" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} width={110} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={hoverCursor} formatter={(v: any) => fmtRupee(Number(v))} />
                  <Bar dataKey="value" fill={breakdownColor} radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </Grid>
        </Grid>
      </Section>

      {/* ── Work mix ── */}
      <Section title="Type of work" description="How much is planned vs reactive, and where jobs stand.">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Panel title="Preventive vs corrective" subtitle="Jobs per week" height={360}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prevVsCorrData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={{ stroke: gridStroke }} />
                  <YAxis stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                  <Legend wrapperStyle={{ fontSize: 12, color: theme.palette.text.secondary }} />
                  <Line type="monotone" dataKey="preventive" stroke="#4CAF50" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="corrective" stroke="#F44336" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Panel title="Distribution" height={360}
              action={<SegmentedToggle<'type' | 'status'> value={mix} onChange={setMix} options={[{ value: 'type', label: 'Type' }, { value: 'status', label: 'Status' }]} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 2 }}>
                <Box sx={{ flex: 1, height: '100%', minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mixData} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={2} dataKey="value">
                        {mixData.map((e) => <Cell key={e.name} fill={e.color} stroke={theme.palette.background.paper} strokeWidth={2} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 130 }}>
                  {mixData.map((e) => (
                    <Box key={e.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: e.color, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ flex: 1 }}>{e.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{e.value}%</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Panel>
          </Grid>
        </Grid>
      </Section>

      {/* ── Reliability ── */}
      <Section title="Reliability" description="Where equipment is down and what keeps breaking.">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Panel title="Downtime by department" subtitle="Total hours" height={360}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={downtimeData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={{ stroke: gridStroke }} />
                  <YAxis stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={hoverCursor} />
                  <Bar dataKey="value" fill="#FF7A45" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Panel title="Most frequently repaired assets" height={360}>
              {freqRepairedAssets.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>No repair jobs yet.</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {freqRepairedAssets.map((asset, i) => (
                    <React.Fragment key={asset.name}>
                      {i > 0 && <Divider />}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.75 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main', fontSize: '0.85rem', fontWeight: 600 }}>
                          {asset.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{asset.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{asset.desc}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{asset.events} events</Typography>
                      </Box>
                    </React.Fragment>
                  ))}
                </Box>
              )}
            </Panel>
          </Grid>
        </Grid>
      </Section>

      {/* ── Records ── */}
      <Section title="Records" description="Who did the work, and the latest jobs.">
        <Panel title="Vendor / technician performance">
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box component="th" sx={tableHeadCellSx}>Vendor / technician</Box>
                  <Box component="th" sx={tableHeadCellSx}>Jobs</Box>
                  <Box component="th" sx={tableHeadCellSx}>Total cost</Box>
                  <Box component="th" sx={tableHeadCellSx}>Avg cost / job</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {vendorPerformance.map((v) => (
                  <Box component="tr" key={v.vendor} sx={tableRowSx}>
                    <Box component="td" sx={{ ...tableCellSx, fontWeight: 500 }}>{v.vendor}</Box>
                    <Box component="td" sx={tableCellSx}>{v.jobs}</Box>
                    <Box component="td" sx={tableCellSx}>{v.cost}</Box>
                    <Box component="td" sx={tableCellSx}>{v.avgPerJob}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Panel>

        <Panel title="Maintenance history">
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', textAlign: 'left' }}>
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {['ID', 'Asset', 'Department', 'Type', 'Vendor', 'Cost', 'Date', 'Status'].map((h) => <Box component="th" key={h} sx={tableHeadCellSx}>{h}</Box>)}
                </Box>
              </Box>
              <Box component="tbody">
                {historyData.map((row) => (
                  <Box component="tr" key={row.id} sx={tableRowSx}>
                    <Box component="td" sx={tableCellSx}>{row.id}</Box>
                    <Box component="td" sx={{ ...tableCellSx, fontWeight: 500 }}>{row.asset}</Box>
                    <Box component="td" sx={{ ...tableCellSx, color: 'text.secondary' }}>{row.dept}</Box>
                    <Box component="td" sx={tableCellSx}>{row.type}</Box>
                    <Box component="td" sx={tableCellSx}>{row.vendor}</Box>
                    <Box component="td" sx={tableCellSx}>{row.cost}</Box>
                    <Box component="td" sx={tableCellSx}>{row.date}</Box>
                    <Box component="td" sx={{ padding: '12px' }}>{statusChip(row.status)}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Panel>
      </Section>
    </Box>
  );
}