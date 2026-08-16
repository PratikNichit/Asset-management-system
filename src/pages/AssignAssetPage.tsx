import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

// ─── Page (container) ─────────────────────────────────────────────────────────

export default function AssignAssetPage({ organizationName = 'Atlas Industries' }: AssignAssetPageProps) {
  const { setBreadcrumbs } = useLayout();
  const theme = useTheme();
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Assign Asset']);
  }, [organizationName, setBreadcrumbs]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAssetSelect = (asset: Asset) => dispatch(assetSelected(asset.id));
  const handleEmployeeSelect = (employee: Employee) => dispatch(employeeSelected(employee.id));
  const handleConfirm = () => dispatch(confirmAssignment());

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Page header */}
      <PageHeader
        title="Assign asset"
        subtitle="Hand over an asset to a team member with a signed acknowledgement."
      />

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
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            3. Confirm &amp; assign
          </Typography>

          {/* Asset summary */}
          {selectedAsset ? (
            <SummaryCard label="ASSET" primary={selectedAsset.name} secondary={selectedAsset.code} />
          ) : (
            <Box
              sx={{
                border: `1.5px dashed ${theme.palette.customColors.borderLight}`,
                borderRadius: 2,
                p: 1.5,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>No asset selected</Typography>
            </Box>
          )}

          {/* Arrow */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowForwardIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
          </Box>

          {/* Employee summary */}
          {selectedEmployee ? (
            <SummaryCard
              label="EMPLOYEE"
              primary={selectedEmployee.name}
              secondary={`${selectedEmployee.department} · ${selectedEmployee.location}`}
            />
          ) : (
            <Box
              sx={{
                border: `1.5px dashed ${theme.palette.customColors.borderLight}`,
                borderRadius: 2,
                p: 1.5,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>No employee selected</Typography>
            </Box>
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

          {/* Confirm button */}
          <AppButton
            id="assign-confirm-btn"
            variant="default"
            fullWidth
            disabled={!canConfirm}
            loading={isSubmitting}
            startIcon={<CheckIcon />}
            onClick={handleConfirm}
            sx={{ mt: 0.5, py: 1.25 }}
          >
            Confirm assignment
          </AppButton>
        </Paper>
      </Box>
    </Box>
  );
}
