import React, { useState } from 'react';
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

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */
const costTrendData = [
  { name: 'Jan', cost: 1200 }, { name: 'Feb', cost: 1900 }, { name: 'Mar', cost: 1100 },
  { name: 'Apr', cost: 2400 }, { name: 'May', cost: 1300 }, { name: 'Jun', cost: 1800 },
  { name: 'Jul', cost: 1000 }, { name: 'Aug', cost: 2100 }, { name: 'Sep', cost: 1400 },
];

const typeDistributionData = [
  { name: 'Calibration', value: 15, color: '#5159D7' },
  { name: 'Corrective', value: 35, color: '#4CAF50' },
  { name: 'Inspection', value: 20, color: '#FFC107' },
  { name: 'Preventive', value: 25, color: '#03A9F4' },
  { name: 'Emergency', value: 5, color: '#F44336' },
];

const statusData = [
  { name: 'Complete', value: 65, color: '#4CAF50' },
  { name: 'In Progress', value: 20, color: '#03A9F4' },
  { name: 'Pending', value: 10, color: '#FF9800' },
  { name: 'Overdue', value: 5, color: '#F44336' },
];

const costBreakdown = {
  asset: [
    { name: 'Injection Molding', value: 45000 },
    { name: 'CNC Machine', value: 38000 },
    { name: 'Forklift A2', value: 22000 },
    { name: 'Air Compressor', value: 18000 },
    { name: 'Conveyor Belt', value: 15000 },
    { name: 'Packaging Unit', value: 12000 },
  ],
  department: [
    { name: 'Production', value: 65000 },
    { name: 'Operations', value: 45000 },
    { name: 'Quality', value: 25000 },
    { name: 'Engineering', value: 18000 },
    { name: 'Facility', value: 12000 },
  ],
  category: [
    { name: 'Machinery', value: 55000 },
    { name: 'Vehicles', value: 35000 },
    { name: 'HVAC', value: 28000 },
    { name: 'IT Eq.', value: 15000 },
    { name: 'Tools', value: 8000 },
  ],
};
type BreakdownKey = keyof typeof costBreakdown;

// NOTE: the old page reused department *cost* numbers for the downtime chart.
// These are placeholder hours - swap for your real downtime data.
const downtimeData = [
  { name: 'Production', value: 142 },
  { name: 'Operations', value: 96 },
  { name: 'Quality', value: 41 },
  { name: 'Engineering', value: 28 },
  { name: 'Facility', value: 19 },
];

const prevVsCorrData = [
  { name: 'W1', preventive: 12, corrective: 4 },
  { name: 'W2', preventive: 8, corrective: 15 },
  { name: 'W3', preventive: 15, corrective: 5 },
  { name: 'W4', preventive: 10, corrective: 12 },
  { name: 'W5', preventive: 18, corrective: 3 },
  { name: 'W6', preventive: 14, corrective: 8 },
];

const vendorPerformance = [
  { vendor: 'In-house Techs', jobs: 124, cost: '₹45,200', rating: '4.8/5' },
  { vendor: 'CAT Services', jobs: 32, cost: '₹28,500', rating: '4.5/5' },
  { vendor: 'HVAC Pros', jobs: 18, cost: '₹15,400', rating: '4.2/5' },
  { vendor: 'Rapid Repair', jobs: 45, cost: '₹32,100', rating: '3.9/5' },
];

const freqRepairedAssets = [
  { name: 'Forklift B3', desc: 'Hydraulic leaks', events: 12 },
  { name: 'Compressor Unit 1', desc: 'Filter issues', events: 9 },
  { name: 'Packaging Line A', desc: 'Sensor faults', events: 8 },
  { name: 'HVAC Roof Unit', desc: 'Coolant leaks', events: 6 },
];

const historyData = [
  { id: 'WO-1042', asset: 'CNC Machine 3', dept: 'Production', type: 'Corrective', vendor: 'In-house', cost: '₹1,200', date: '2026-09-22', status: 'Completed' },
  { id: 'WO-1043', asset: 'Forklift A1', dept: 'Operations', type: 'Preventive', vendor: 'CAT Services', cost: '₹450', date: '2026-09-23', status: 'In Progress' },
  { id: 'WO-1044', asset: 'HVAC Unit', dept: 'Facility', type: 'Emergency', vendor: 'HVAC Pros', cost: '₹3,200', date: '2026-09-24', status: 'Pending' },
];

const primaryFilters = ['Date range: All time', 'Category: All', 'Department: All', 'Vendor: All'];
const moreFilters = ['Location: All', 'Maintenance type: All', 'Asset status: All', 'Assignee: All'];

/* ------------------------------------------------------------------ */
/* Small layout helpers                                                */
/* ------------------------------------------------------------------ */

// Section = heading + short description + content. This is what gives the
// page its structure: the reader always knows which question a block answers.
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{title}</Typography>
        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
}

// Card shell: fixed header row (title left, optional control right) and a
// body that fills the rest. `height` is only set for charts.
function Panel({
  title,
  subtitle,
  action,
  height,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  height?: number;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        height: height ?? '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2, minHeight: 36 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subtitle}</Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}

function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, v) => v && onChange(v)}
      sx={{
        '& .MuiToggleButton-root': {
          textTransform: 'none',
          fontSize: '0.75rem',
          px: 1.25,
          py: 0.25,
          borderColor: 'divider',
        },
      }}
    >
      {options.map((o) => (
        <ToggleButton key={o.value} value={o.value}>{o.label}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const FilterDropdown = ({ label }: { label: string }) => (
  <Button
    variant="outlined"
    color="inherit"
    endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
    sx={{
      color: 'text.secondary',
      borderColor: 'divider',
      textTransform: 'none',
      fontSize: '0.82rem',
      fontWeight: 400,
      justifyContent: 'space-between',
      width: '100%',
      px: 1.5,
      py: 0.75,
      borderRadius: 1.5,
    }}
  >
    {label}
  </Button>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function MaintenanceReportTab() {
  const theme = useTheme();
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [breakdown, setBreakdown] = useState<BreakdownKey>('asset');
  const [mix, setMix] = useState<'type' | 'status'>('type');

  const gridStroke = theme.palette.divider;
  const axisStroke = theme.palette.text.secondary;
  const axisTick = { fontSize: 12, fill: theme.palette.text.secondary };
  const tooltipStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#1A1D27',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: '0.8rem',
    boxShadow: theme.shadows[3],
  };
  const tooltipItemStyle = { color: '#fff' };
  const tooltipLabelStyle = { color: alpha('#fff', 0.7) };
  const hoverCursor = { fill: alpha(theme.palette.text.primary, 0.04) };

  const tableHeadCellSx = {
    padding: '10px 12px',
    color: 'text.secondary',
    fontSize: '0.75rem',
    fontWeight: 600,
  };
  const tableRowSx = {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-of-type': { borderBottom: 'none' },
    '&:hover': { bgcolor: 'action.hover' },
  };
  const tableCellSx = { padding: '12px', fontSize: '0.85rem', color: 'text.primary' };

  const mixData = mix === 'type' ? typeDistributionData : statusData;
  const breakdownColor = { asset: '#5159D7', department: '#4CAF50', category: '#03A9F4' }[breakdown];

  const statusChip = (status: string) => {
    const map: Record<string, { bg: string; fg: string }> = {
      Completed: { bg: '#4CAF50', fg: '#2E7D32' },
      'In Progress': { bg: '#03A9F4', fg: '#0277BD' },
      Pending: { bg: '#FF9800', fg: '#E65100' },
    };
    const c = map[status] ?? map.Pending;
    return (
      <Chip
        label={status}
        size="small"
        sx={{ fontSize: '0.7rem', fontWeight: 600, height: 22, bgcolor: alpha(c.bg, 0.15), color: c.fg }}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

      {/* ── 1. Filters: one slim bar, 4 essentials + expandable rest ── */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
          <FilterListOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>Filters</Typography>
          <Button
            size="small"
            onClick={() => setShowMoreFilters((s) => !s)}
            sx={{ textTransform: 'none' }}
          >
            {showMoreFilters ? 'Fewer filters' : 'More filters'}
          </Button>
          <Button size="small" color="inherit" sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Reset
          </Button>
        </Box>
        <Grid container spacing={1.5}>
          {primaryFilters.map((f) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={f}><FilterDropdown label={f} /></Grid>
          ))}
        </Grid>
        <Collapse in={showMoreFilters}>
          <Grid container spacing={1.5} sx={{ mt: 0 }}>
            {moreFilters.map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={f}><FilterDropdown label={f} /></Grid>
            ))}
          </Grid>
        </Collapse>
      </Paper>

      {/* ── 2. Overview: 4 headline KPIs + one quiet strip for the rest ── */}
      <Section title="Overview" description="The numbers that need attention first.">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Total maintenance cost" value="₹155,633" icon={<CurrencyRupeeOutlinedIcon style={{ color: '#5159D7' }} />} iconBgColor="#5159D71A" trendValue="12.2%" trendDirection="down" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Total maintenance tasks" value="205" icon={<BuildOutlinedIcon style={{ color: '#03A9F4' }} />} iconBgColor="#03A9F41A" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Overdue maintenance" value="11" icon={<WarningAmberOutlinedIcon style={{ color: '#FF9800' }} />} iconBgColor="#FF98001A" note="High priority issues" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Average downtime" value="12.2h" icon={<AccessTimeOutlinedIcon style={{ color: '#F44336' }} />} iconBgColor="#F443361A" note="per job" />
          </Grid>
        </Grid>

        <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Grid container>
            {[
              { label: 'Avg cost per asset', value: '₹12,969' },
              { label: 'Assets under repair', value: '11', note: 'out of 2,148' },
              { label: 'Completed on time', value: '96 / 109', note: '88% compliance' },
              { label: 'Planned vs actual cost', value: '₹16,584', note: '14.2% over budget', warn: true },
            ].map((m, i) => (
              <Grid
                size={{ xs: 6, md: 3 }}
                key={m.label}
                sx={{
                  p: 2.5,
                  borderLeft: { md: i === 0 ? 'none' : `1px solid ${theme.palette.divider}` },
                  borderTop: { xs: i > 1 ? `1px solid ${theme.palette.divider}` : 'none', md: 'none' },
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{m.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{m.value}</Typography>
                {m.note && (
                  <Typography variant="caption" sx={{ color: m.warn ? 'error.main' : 'text.secondary' }}>
                    {m.note}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Section>

      {/* ── 3. Cost ── */}
      <Section title="Where the money goes" description="Spend over time and what drives it.">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Panel title="Monthly maintenance cost" height={360}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costTrendData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={{ stroke: gridStroke }} />
                  <YAxis stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                  <Line type="monotone" dataKey="cost" stroke="#5159D7" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </Grid>

          {/* Three near-identical bar charts collapsed into one switchable panel */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Panel
              title="Cost breakdown"
              height={360}
              action={
                <SegmentedToggle<BreakdownKey>
                  value={breakdown}
                  onChange={setBreakdown}
                  options={[
                    { value: 'asset', label: 'Asset' },
                    { value: 'department', label: 'Department' },
                    { value: 'category', label: 'Category' },
                  ]}
                />
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBreakdown[breakdown]} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                  <XAxis type="number" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke={axisStroke} tick={axisTick} tickLine={false} axisLine={false} width={110} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={hoverCursor} />
                  <Bar dataKey="value" fill={breakdownColor} radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </Grid>
        </Grid>
      </Section>

      {/* ── 4. Work mix ── */}
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

          {/* Two donuts collapsed into one panel with a custom legend */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Panel
              title="Distribution"
              height={360}
              action={
                <SegmentedToggle<'type' | 'status'>
                  value={mix}
                  onChange={setMix}
                  options={[
                    { value: 'type', label: 'Type' },
                    { value: 'status', label: 'Status' },
                  ]}
                />
              }
            >
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 2 }}>
                <Box sx={{ flex: 1, height: '100%', minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mixData} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={2} dataKey="value">
                        {mixData.map((e) => (
                          <Cell key={e.name} fill={e.color} stroke={theme.palette.background.paper} strokeWidth={2} />
                        ))}
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

      {/* ── 5. Reliability ── */}
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
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {asset.events} events
                      </Typography>
                    </Box>
                  </React.Fragment>
                ))}
              </Box>
            </Panel>
          </Grid>
        </Grid>
      </Section>

      {/* ── 6. Records: vendors + history, one calm block at the bottom ── */}
      <Section title="Records" description="Who did the work, and the latest jobs.">
        <Panel title="Vendor performance">
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box component="th" sx={tableHeadCellSx}>Vendor</Box>
                  <Box component="th" sx={tableHeadCellSx}>Jobs</Box>
                  <Box component="th" sx={tableHeadCellSx}>Total cost</Box>
                  <Box component="th" sx={tableHeadCellSx}>Avg rating</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {vendorPerformance.map((v) => (
                  <Box component="tr" key={v.vendor} sx={tableRowSx}>
                    <Box component="td" sx={{ ...tableCellSx, fontWeight: 500 }}>{v.vendor}</Box>
                    <Box component="td" sx={tableCellSx}>{v.jobs}</Box>
                    <Box component="td" sx={tableCellSx}>{v.cost}</Box>
                    <Box component="td" sx={tableCellSx}>{v.rating}</Box>
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
                  {['ID', 'Asset', 'Department', 'Type', 'Vendor', 'Cost', 'Date', 'Status'].map((h) => (
                    <Box component="th" key={h} sx={tableHeadCellSx}>{h}</Box>
                  ))}
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