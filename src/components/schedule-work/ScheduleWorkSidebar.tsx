import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import type { RecurrenceOption, ScheduleWorkFormState } from '../../redux/maintenanceSlice';
import AppButton from '../AppButton';
import { FieldLabel, SectionCard } from './FormHelpers';

const RECURRENCE_OPTIONS: RecurrenceOption[] = [
  'Does not repeat',
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Annually',
];

export interface ScheduleWorkSidebarProps {
  form: ScheduleWorkFormState;
  canSubmit: boolean;
  onFieldChange: (field: keyof ScheduleWorkFormState) => (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ScheduleWorkSidebar({
  form,
  canSubmit,
  onFieldChange,
  onSubmit,
  onCancel,
}: ScheduleWorkSidebarProps) {
  return (
    <Box sx={{ flex: '0 0 280px', minWidth: 260, position: 'sticky', top: 16 }}>
      {/* Recurrence card */}
      <SectionCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
          <RepeatIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Recurrence</Typography>
        </Box>

        <FieldLabel>Repeat</FieldLabel>
        <Select
          id="sw-recurrence"
          fullWidth
          size="small"
          sx={{ '& .MuiSelect-select': { fontSize: '0.85rem' } }}
          value={form.recurrence}
          onChange={(e) => onFieldChange('recurrence')(e.target.value)}
        >
          {RECURRENCE_OPTIONS.map((r) => (
            <MenuItem key={r} value={r} sx={{ fontSize: '0.85rem' }}>
              {r}
            </MenuItem>
          ))}
        </Select>

        <Typography
          sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 1.25, lineHeight: 1.5 }}
        >
          Recurring orders are generated automatically after each completion.
        </Typography>
      </SectionCard>

      {/* Info callout */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          borderColor: 'primary.main',
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(109, 93, 246, 0.06)' : 'rgba(109, 93, 246, 0.12)',
          display: 'flex',
          gap: 1.25,
          mb: 2,
        }}
      >
        <InfoOutlinedIcon
          sx={{ fontSize: 17, color: 'primary.main', mt: 0.1, flexShrink: 0 }}
        />
        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.6 }}>
          Scheduling work sets the asset status to{' '}
          <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Maintenance
          </Box>{' '}
          on the start date.
        </Typography>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      <AppButton
        id="schedule-work-submit-sidebar-btn"
        variant="default"
        fullWidth
        startIcon={<BuildOutlinedIcon />}
        disabled={!canSubmit}
        onClick={onSubmit}
        sx={{ boxShadow: canSubmit ? '0 2px 8px rgba(109, 93, 246, 0.35)' : 'none' }}
      >
        Schedule work
      </AppButton>
      <AppButton
        id="schedule-work-cancel-sidebar-btn"
        variant="ghost"
        fullWidth
        onClick={onCancel}
        sx={{ mt: 1 }}
      >
        Cancel
      </AppButton>
    </Box>
  );
}