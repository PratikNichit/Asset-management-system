import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  searchQueryChanged,
  typeFilterChanged,
  statusFilterChanged,
  selectWorkOrderCounts,
  selectFilteredWorkOrders,
  selectSearchQuery,
  selectTypeFilter,
  selectStatusFilter,
  type WorkOrderStatus,
  type WorkOrderType,
  type WorkOrder,
} from '../redux/maintenanceSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import PageHeader from '../components/PageHeader';
import AssetClickableName from '../components/AssetClickableName';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import type { DataTableColumnDef } from '../components/DataTable';

// ─── Constants ────────────────────────────────────────────────────────────────

const WORK_ORDER_TYPES: Array<WorkOrderType | 'All'> = [
  'All', 'Repair', 'Preventive', 'Calibration', 'Inspection',
];

const WORK_ORDER_STATUSES: Array<WorkOrderStatus | 'All'> = [
  'All', 'Scheduled', 'In Progress', 'Overdue', 'Completed',
];

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<WorkOrderStatus, { dotColor: string; bg: string; label: string }> = {
  'Scheduled':   { dotColor: '#5159D7', bg: '#5159D71A', label: 'Scheduled'   },
  'In Progress': { dotColor: '#009BD8', bg: '#009BD826', label: 'In Progress'  },
  'Overdue':     { dotColor: '#E62C2C', bg: '#E62C2C26', label: 'Overdue'     },
  'Completed':   { dotColor: '#20B46B', bg: '#20B46B26', label: 'Completed'   },
};

// ─── Type badge config ────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<WorkOrderType, { color: string }> = {
  'Repair':      { color: '#E62C2C' },
  'Preventive':  { color: '#5159D7' },
  'Calibration': { color: '#009BD8' },
  'Inspection':  { color: '#EFA831' },
};

// ─── Table Columns ────────────────────────────────────────────────────────────

const MAINTENANCE_COLUMNS: DataTableColumnDef<WorkOrder>[] = [
  {
    key: 'asset',
    header: 'ASSET',
    render: (wo) => (
      <AssetClickableName assetId={wo.assetCode} name={wo.assetName} code={wo.assetCode} />
    ),
  },
  {
    key: 'type',
    header: 'TYPE',
    render: (wo) => {
      const typeCfg = TYPE_CONFIG[wo.type];
      return (
        <Typography sx={{ fontSize: '0.83rem', color: typeCfg.color, fontWeight: 500 }}>
          {wo.type}
        </Typography>
      );
    },
  },
  {
    key: 'date',
    header: 'DATE',
    render: (wo) => (
      <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary' }}>
        {wo.date}
      </Typography>
    ),
  },
  {
    key: 'technician',
    header: 'TECHNICIAN',
    render: (wo) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            width: 26,
            height: 26,
            bgcolor: wo.technicianAvatarColor + '22',
            color: wo.technicianAvatarColor,
            fontSize: '0.62rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {wo.technicianAvatar}
        </Avatar>
        <Typography sx={{ fontSize: '0.83rem', fontWeight: 500, color: wo.technicianAvatarColor }}>
          {wo.technicianName}
        </Typography>
      </Box>
    ),
  },
  {
    key: 'cost',
    header: 'COST',
    render: (wo) => (
      <Typography sx={{ fontSize: '0.83rem', fontWeight: 600 }}>
        ${wo.costUsd.toLocaleString()}
      </Typography>
    ),
  },
  {
    key: 'status',
    header: 'STATUS',
    render: (wo) => {
      const statusCfg = STATUS_CONFIG[wo.status];
      return (
        <Chip
          size="small"
          icon={
            <CircleIcon
              sx={{ fontSize: '8px !important', color: `${statusCfg.dotColor} !important` }}
            />
          }
          label={statusCfg.label}
          sx={{
            bgcolor: statusCfg.bg,
            color: statusCfg.dotColor,
            fontWeight: 600,
            fontSize: '0.72rem',
            height: 24,
            borderRadius: '999px',
            border: 'none',
            width: 'fit-content',
            '& .MuiChip-icon': { ml: '6px', mr: '-4px' },
          }}
        />
      );
    },
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MaintenancePageProps {
  organizationName?: string;
  /** Optional override; defaults to navigate('/maintenance/schedule') */
  onScheduleWork?: () => void;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MaintenancePage({
  organizationName = 'Atlas Industries',
  onScheduleWork,
}: MaintenancePageProps) {
  const navigate = useNavigate();
  const { setBreadcrumbLinks } = useLayout();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const handleScheduleWork = () => {
    if (onScheduleWork) onScheduleWork();
    else navigate('/maintenance/schedule');
  };

  const counts = useAppSelector(selectWorkOrderCounts);
  const workOrders = useAppSelector(selectFilteredWorkOrders);
  const searchQuery = useAppSelector(selectSearchQuery);
  const typeFilter = useAppSelector(selectTypeFilter);
  const statusFilter = useAppSelector(selectStatusFilter);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Maintenance' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  return (
    <Box>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <PageHeader
        title="Maintenance"
        subtitle="Track preventive, corrective, and calibration work across all assets."
        actions={
          <AppButton
            id="schedule-work-btn"
            variant="default"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: 'nowrap' }}
            onClick={handleScheduleWork}
          >
            Schedule work
          </AppButton>
        }
      />

      {/* ── Stat cards row ────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <StatCard
          label="Scheduled"
          value={counts.scheduled}
          icon={<EventNoteOutlinedIcon sx={{ color: '#5159D7' }} />}
          iconBgColor="#5159D71A"
        />
        <StatCard
          label="In progress"
          value={counts.inProgress}
          icon={<BuildOutlinedIcon sx={{ color: '#009BD8' }} />}
          iconBgColor="#009BD826"
        />
        <StatCard
          label="Overdue"
          value={counts.overdue}
          icon={<WarningAmberOutlinedIcon sx={{ color: '#E62C2C' }} />}
          iconBgColor="#E62C2C26"
        />
        <StatCard
          label="Completed (30d)"
          value={counts.completedRecent}
          icon={<CheckCircleOutlineIcon sx={{ color: '#20B46B' }} />}
          iconBgColor="#20B46B26"
        />
      </Box>

      {/* ── Work orders table ─────────────────────────────────────────────── */}
      <DataTable
        data={workOrders}
        columns={MAINTENANCE_COLUMNS}
        keyExtractor={(wo) => wo.id}
        emptyMessage="No work orders match your filters."
        toolbar={
          <>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', flex: '0 0 auto' }}>
              Work orders
            </Typography>

            <OutlinedInput
              value={searchQuery}
              onChange={(e) => dispatch(searchQueryChanged(e.target.value))}
              placeholder="Search assets, technicians…"
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{
                fontSize: '0.83rem',
                flex: 1,
                minWidth: 180,
                maxWidth: 280,
                '& fieldset': { borderColor: theme.palette.customColors.borderLight },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                borderRadius: 1.5,
              }}
            />

            <Select
              value={typeFilter}
              onChange={(e) => dispatch(typeFilterChanged(e.target.value as WorkOrderType | 'All'))}
              size="small"
              sx={{
                fontSize: '0.83rem',
                minWidth: 130,
                '& fieldset': { borderColor: theme.palette.customColors.borderLight },
                borderRadius: 1.5,
              }}
            >
              {WORK_ORDER_TYPES.map((t) => (
                <MenuItem key={t} value={t} sx={{ fontSize: '0.83rem' }}>
                  {t === 'All' ? 'All types' : t}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => dispatch(statusFilterChanged(e.target.value as WorkOrderStatus | 'All'))}
              size="small"
              sx={{
                fontSize: '0.83rem',
                minWidth: 140,
                '& fieldset': { borderColor: theme.palette.customColors.borderLight },
                borderRadius: 1.5,
              }}
            >
              {WORK_ORDER_STATUSES.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: '0.83rem' }}>
                  {s === 'All' ? 'All statuses' : s}
                </MenuItem>
              ))}
            </Select>
          </>
        }
      />
    </Box>
  );
}
