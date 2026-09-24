import { useEffect, useState, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  assetSelected,
  employeeSelected,
  handoverDateChanged,
  notesChanged,
  confirmAssignment,
  selectAllAssets,
  selectAllEmployees,
  selectSelectedAsset,
  selectSelectedEmployee,
  selectSelectedAssetId,
  selectSelectedEmployeeId,
  selectHandoverDate,
  selectNotes,
  selectIsSubmitting,
  selectCanConfirm,
  selectAssignError,
} from '../redux/assignAssetSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import PageHeader from '../components/PageHeader';
import PickerPanel from '../components/PickerPanel';
import SummaryCard from '../components/SummaryCard';
import type { Asset } from '../types/asset';
import type { Employee } from '../types/employee';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AssignAssetPageProps {
  organizationName?: string;
}

// ─── Small helper: numbered column header, kept visually consistent
//     with whatever step/icon/label pattern PickerPanel renders internally ───

function ColumnHeader({
  step,
  done,
  icon,
  label,
}: {
  step: number;
  done: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          flexShrink: 0,
          bgcolor: done ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
          color: done ? '#fff' : theme.palette.primary.main,
          transition: 'all 0.2s ease',
        }}
      >
        {done ? <CheckIcon sx={{ fontSize: 14 }} /> : step}
      </Box>
      {icon}
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{label}</Typography>
    </Box>
  );
}

// ─── Empty-state placeholder for the summary column ──────────────────────────

function EmptySlot({ icon, label }: { icon: React.ReactNode; label: string }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: `1.5px dashed ${theme.palette.customColors.borderLight}`,
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        color: 'text.disabled',
      }}
    >
      <Box sx={{ '& svg': { fontSize: 22 } }}>{icon}</Box>
      <Typography sx={{ fontSize: '0.8rem' }}>{label}</Typography>
    </Box>
  );
}

// ─── Page (container) ─────────────────────────────────────────────────────────

export default function AssignAssetPage({ organizationName = 'Atlas Industries' }: AssignAssetPageProps) {
  const { setBreadcrumbLinks, navigateToAsset } = useLayout();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Track previous submitting state to detect transition from submitting → done.
  const wasSubmitting = useRef(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // ── Selectors ───────────────────────────────────────────────────────────────
  const assets = useAppSelector(selectAllAssets);
  const employees = useAppSelector(selectAllEmployees);
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const selectedEmployee = useAppSelector(selectSelectedEmployee);
  const selectedAssetId = useAppSelector(selectSelectedAssetId);
  const selectedEmployeeId = useAppSelector(selectSelectedEmployeeId);
  const handoverDate = useAppSelector(selectHandoverDate);
  const notes = useAppSelector(selectNotes);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const canConfirm = useAppSelector(selectCanConfirm);
  const assignError = useAppSelector(selectAssignError);

  // Navigate to /assets after a successful assignment.
  useEffect(() => {
    if (wasSubmitting.current && !isSubmitting && !assignError) {
      setSuccessOpen(true);
      const timer = setTimeout(() => navigate('/assets', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }
    wasSubmitting.current = isSubmitting;
  }, [isSubmitting, assignError, navigate]);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Assign Asset' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAssetSelect = (asset: Asset) => dispatch(assetSelected(asset.id));
  const handleEmployeeSelect = (employee: Employee) => dispatch(employeeSelected(employee.id));
  const handleConfirm = () => {
    wasSubmitting.current = true;
    dispatch(confirmAssignment());
  };

  // ── Friendly, situation-aware copy ────────────────────────────────────────
  const subtitle = useMemo(() => {
    if (selectedAsset && selectedEmployee) return 'Everything looks good — set a date and confirm the handover below.';
    if (selectedAsset && !selectedEmployee) return `${selectedAsset.name} selected — now choose who's receiving it.`;
    if (!selectedAsset && selectedEmployee) return `${selectedEmployee.name} selected — now choose which asset to hand over.`;
    return 'Hand over an asset to a team member with a signed acknowledgement.';
  }, [selectedAsset, selectedEmployee]);

  const confirmHint = !selectedAsset && !selectedEmployee
    ? 'Pick an asset and an employee to continue.'
    : !selectedAsset
      ? 'Pick an asset to continue.'
      : !selectedEmployee
        ? 'Pick an employee to continue.'
        : !handoverDate
          ? 'Add a handover date to continue.'
          : null;

  // ── Already-assigned detection ────────────────────────────────────────────
  const isAlreadyAssigned = Boolean(selectedAsset?.assignedTo);
  const currentAssignee = selectedAsset?.assignedTo ?? null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        // Themed, thin scrollbars for this page and everything scrollable inside it
        // (covers PickerPanel's internal lists too, since they render as descendants).
        '& *': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(theme.palette.text.primary, 0.18)} transparent`,
        },
        '& *::-webkit-scrollbar': { width: 8, height: 8 },
        '& *::-webkit-scrollbar-track': { background: 'transparent' },
        '& *::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.text.primary, 0.18),
          borderRadius: 8,
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
        },
        '& *::-webkit-scrollbar-thumb:hover': {
          background: alpha(theme.palette.primary.main, 0.45),
        },
      }}
    >
      {/* Page header */}
      <PageHeader title="Assign asset" subtitle={subtitle} />

      {/* 3-column layout */}
      <Box
        sx={{
          display: 'flex',
          gap: 2.5,
          alignItems: 'flex-start',
          flexWrap: { xs: 'wrap', lg: 'nowrap' },
        }}
      >
        {/* ── Column 1: Pick asset ──────────────────────────────────────────── */}
        <PickerPanel<Asset>
          step={1}
          icon={<Inventory2OutlinedIcon />}
          label="Pick asset"
          items={assets}
          selectedId={selectedAssetId}
          onSelect={handleAssetSelect}
          searchPlaceholder="Search assets…"
          sx={{ maxWidth: { lg: 500 } }}
          filterFn={(a, q) =>
            a.name.toLowerCase().includes(q) ||
            a.code.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q)
          }
          renderItem={(asset, isSelected) => (
            <Box>
              <Typography
                sx={{
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '0.87rem',
                  color: isSelected ? theme.palette.primary.main : 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                {asset.name}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.2, fontFamily: '"Roboto Mono", monospace' }}>
                {asset.code} · {asset.category}
              </Typography>
            </Box>
          )}
        />

        {/* ── Column 2: Pick employee ───────────────────────────────────────── */}
        <PickerPanel<Employee>
          step={2}
          icon={<PersonOutlinedIcon />}
          label="Pick employee"
          items={employees}
          selectedId={selectedEmployeeId}
          onSelect={handleEmployeeSelect}
          searchPlaceholder="Search employees…"
          sx={{ maxWidth: { lg: 500 } }}
          filterFn={(e, q) =>
            e.name.toLowerCase().includes(q) ||
            e.role.toLowerCase().includes(q) ||
            e.department.toLowerCase().includes(q)
          }
          renderItem={(employee, isSelected) => (
            <Box>
              <Typography
                sx={{
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '0.87rem',
                  color: isSelected ? theme.palette.primary.main : 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                {employee.name}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.2 }}>
                {employee.role} · {employee.department}
              </Typography>
            </Box>
          )}
        />

        {/* ── Column 3: Confirm & assign ────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: '100%', lg: 500 },
            flexShrink: 0,
            border: `1px solid ${theme.palette.customColors.borderLight}`,
            borderRadius: 2.5,
            p: 2,
            bgcolor: theme.palette.customColors.white,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            position: { lg: 'sticky' },
            top: { lg: 88 },
          }}
        >
          <ColumnHeader
            step={3}
            done={Boolean(selectedAsset && selectedEmployee)}
            icon={<AssignmentTurnedInOutlinedIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />}
            label="Confirm & assign"
          />

          {/* Asset summary */}
          {selectedAsset ? (
            <SummaryCard
              label="ASSET"
              primary={selectedAsset.name}
              secondary={selectedAsset.code}
              onClick={() => navigateToAsset(selectedAsset.id)}
            />
          ) : (
            <EmptySlot icon={<Inventory2OutlinedIcon />} label="No asset selected yet" />
          )}

          {/* ── Already-assigned warning ──────────────────────────────────── */}
          {isAlreadyAssigned && currentAssignee && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'warning.main',
                background: (t) => `linear-gradient(135deg, ${alpha(t.palette.warning.main, 0.12)} 0%, ${alpha(t.palette.warning.light, 0.08)} 100%)`,
                border: (t) => `1.5px solid ${alpha(t.palette.warning.main, 0.35)}`,
              }}
            >
              <WarningAmberRoundedIcon
                sx={{ fontSize: 18, color: 'warning.dark', mt: 0.1, flexShrink: 0 }}
              />
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'warning.dark', lineHeight: 1.3 }}>
                  Already assigned
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'warning.dark', opacity: 0.85, mt: 0.3, lineHeight: 1.4 }}>
                  This asset is currently with <strong>{currentAssignee}</strong>. Confirming will revoke access from them and hand it to the new employee.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Arrow */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowForwardIcon
              sx={{
                fontSize: 18,
                color: selectedAsset && selectedEmployee ? theme.palette.primary.main : 'text.disabled',
                transition: 'color 0.2s ease',
              }}
            />
          </Box>

          {/* Employee summary */}
          {selectedEmployee ? (
            <SummaryCard
              label="EMPLOYEE"
              primary={selectedEmployee.name}
              secondary={`${selectedEmployee.department} · ${selectedEmployee.location}`}
            />
          ) : (
            <EmptySlot icon={<PersonOutlinedIcon />} label="No employee selected yet" />
          )}

          <Divider sx={{ borderColor: theme.palette.customColors.borderLight }} />

          {/* Handover date */}
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>Handover date</Typography>
            <OutlinedInput
              id="assign-handover-date"
              type="date"
              value={handoverDate}
              onChange={(e) => dispatch(handoverDateChanged(e.target.value))}
              size="small"
              fullWidth
              sx={{
                fontSize: '0.85rem',
                '& fieldset': { borderColor: theme.palette.customColors.borderLight },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                borderRadius: 1.5,
              }}
            />
          </Box>

          {/* Notes */}
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>Notes</Typography>
            <TextField
              id="assign-notes"
              multiline
              rows={3}
              fullWidth
              placeholder="Condition, accessories, expected return…"
              value={notes}
              onChange={(e) => dispatch(notesChanged(e.target.value))}
              size="small"
              sx={{
                '& fieldset': { borderColor: theme.palette.customColors.borderLight },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.85rem' },
              }}
            />
          </Box>

          {/* Confirm / Reassign button */}
          <AppButton
            id="assign-confirm-btn"
            variant="default"
            fullWidth
            disabled={!canConfirm}
            loading={isSubmitting}
            startIcon={<CheckIcon />}
            onClick={handleConfirm}
            sx={{
              py: 1.25,
              ...(isAlreadyAssigned && canConfirm && {
                bgcolor: 'warning.main',
                '&:hover': { bgcolor: 'warning.dark' },
                boxShadow: '0 2px 8px rgba(234,179,8,0.3)',
              }),
            }}
          >
            {isAlreadyAssigned ? 'Reassign asset' : 'Confirm assignment'}
          </AppButton>

          {/* Explain why the button is disabled, instead of leaving people guessing */}
          {confirmHint && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: 'center', mt: -1 }}>
              <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>{confirmHint}</Typography>
            </Box>
          )}

          {/* Error message */}
          {assignError && (
            <MuiAlert severity="error" sx={{ fontSize: '0.8rem', py: 0.5 }}>
              {assignError}
            </MuiAlert>
          )}
        </Paper>
      </Box>

      {/* Success snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={1500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          Asset assigned successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}