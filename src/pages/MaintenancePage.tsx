import React, { useEffect } from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

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
  updateWorkOrderAsync,
  deleteWorkOrderAsync,
} from '../redux/maintenanceSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import PageHeader from '../components/PageHeader';
import AssetClickableName from '../components/AssetClickableName';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import EditWorkOrderModal from '../components/EditWorkOrderModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
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
  'Scheduled': { dotColor: '#5159D7', bg: '#5159D71A', label: 'Scheduled' },
  'In Progress': { dotColor: '#009BD8', bg: '#009BD826', label: 'In Progress' },
  'Overdue': { dotColor: '#E62C2C', bg: '#E62C2C26', label: 'Overdue' },
  'Completed': { dotColor: '#20B46B', bg: '#20B46B26', label: 'Completed' },
};

// ─── Type badge config ────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<WorkOrderType, { color: string }> = {
  'Repair': { color: '#E62C2C' },
  'Preventive': { color: '#5159D7' },
  'Calibration': { color: '#009BD8' },
  'Inspection': { color: '#EFA831' },
};

// Columns are moved to a useMemo inside the component to access handlers
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

  const [editingWo, setEditingWo] = React.useState<WorkOrder | null>(null);
  const [deletingWo, setDeletingWo] = React.useState<WorkOrder | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );

  const handleEditWo = (wo: WorkOrder) => setEditingWo(wo);
  const handleDeleteWo = (wo: WorkOrder) => setDeletingWo(wo);

  const handleSaveEdit = async (updated: Partial<WorkOrder> & { id: string }) => {
    setIsSaving(true);
    try {
      await dispatch(updateWorkOrderAsync(updated)).unwrap();
      setEditingWo(null);
      setSnackbar({ open: true, message: 'Work order updated successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update work order', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingWo) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteWorkOrderAsync(deletingWo.id)).unwrap();
      setDeletingWo(null);
      setSnackbar({ open: true, message: `Work order ${deletingWo.id} deleted`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete work order', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const MAINTENANCE_COLUMNS: DataTableColumnDef<WorkOrder>[] = React.useMemo(() => [
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
        const typeCfg = TYPE_CONFIG[wo.type] ?? { color: theme.palette.text.secondary };
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
          ₹{wo.costUsd.toLocaleString()}
        </Typography>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (wo) => {
        const statusCfg = STATUS_CONFIG[wo.status] ?? {
          dotColor: theme.palette.text.secondary,
          bg: theme.palette.action.hover,
          label: wo.status,
        };
        return (
          <Chip
            size="small"
            icon={<CircleIcon sx={{ fontSize: '8px !important', color: `${statusCfg.dotColor} !important` }} />}
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
    {
      key: 'actions',
      header: '',
      render: (wo) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditWo(wo); }}>
            <EditOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </IconButton>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteWo(wo); }}>
            <DeleteOutlinedIcon fontSize="small" sx={{ color: 'error.main' }} />
          </IconButton>
        </Box>
      ),
    },
  ], []);

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
        emptyMessage="No work orders found."
        toolbar={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <OutlinedInput
              size="small"
              placeholder="Search by ID or asset..."
              value={searchQuery}
              onChange={(e) => dispatch(searchQueryChanged(e.target.value))}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              }
              sx={{
                width: 260,
                borderRadius: '10px',
                bgcolor: theme.palette.customColors.white,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.customColors.borderLight },
              }}
            />

            <Select
              size="small"
              displayEmpty
              value={typeFilter}
              onChange={(e) => dispatch(typeFilterChanged(e.target.value as WorkOrderType | 'All'))}
              sx={{
                width: 140,
                borderRadius: '10px',
                bgcolor: theme.palette.customColors.white,
                fontWeight: 600,
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.customColors.borderLight },
              }}
            >
              {WORK_ORDER_TYPES.map((t) => (
                <MenuItem key={t} value={t} sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  {t === 'All' ? 'All Types' : t}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              displayEmpty
              value={statusFilter}
              onChange={(e) => dispatch(statusFilterChanged(e.target.value as WorkOrderStatus | 'All'))}
              sx={{
                width: 160,
                borderRadius: '10px',
                bgcolor: theme.palette.customColors.white,
                fontWeight: 600,
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.customColors.borderLight },
              }}
            >
              {WORK_ORDER_STATUSES.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  {s === 'All' ? 'All Statuses' : s}
                </MenuItem>
              ))}
            </Select>
          </Box>
        }
      />

      {/* ── Modals & Dialogs ─────────────────────────────────────────────────── */}
      <EditWorkOrderModal
        open={Boolean(editingWo)}
        workOrder={editingWo}
        onClose={() => setEditingWo(null)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingWo)}
        entityName={`Work Order ${deletingWo?.id}`}
        onClose={() => setDeletingWo(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
