import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import type { WorkOrderType, WorkOrderStatus, WorkOrderPriority, ScheduleWorkFormState } from '../../redux/maintenanceSlice';
import type { Asset } from '../../types/asset';
import { FieldLabel, SectionCard, SectionHeading, selectSx, fieldSx } from './FormHelpers';

const WORK_ORDER_TYPES: WorkOrderType[] = ['Preventive', 'Repair', 'Calibration', 'Inspection'];
const WORK_ORDER_STATUSES: WorkOrderStatus[] = ['Scheduled', 'In Progress', 'Overdue', 'Completed'];
const PRIORITIES: WorkOrderPriority[] = ['Low', 'Medium', 'High', 'Critical'];

const PRIORITY_COLORS: Record<WorkOrderPriority, string> = {
  Low: '#64748B',
  Medium: '#2563EB',
  High: '#D97706',
  Critical: '#DC2626',
};

export interface WorkOrderFormSectionProps {
  form: ScheduleWorkFormState;
  assets: Asset[];
  onFieldChange: (field: keyof ScheduleWorkFormState) => (value: string) => void;
  /** When true, required-but-empty fields show an error state. Set after a failed "Next". */
  showErrors?: boolean;
}

export default function WorkOrderFormSection({
  form,
  assets,
  onFieldChange,
  showErrors = false,
}: WorkOrderFormSectionProps) {
  const titleError = showErrors && !form.title?.trim();
  const assetError = showErrors && !form.assetId;
  const typeError = showErrors && !form.type;
  return (
    <SectionCard>
      <SectionHeading
        title="Work order"
        subtitle="What needs to be done and on which asset."
      />

      {/* Title */}
      <Box sx={{ mb: 2.5 }}>
        <FieldLabel required>Title</FieldLabel>
        <TextField
          id="sw-title"
          fullWidth
          size="small"
          placeholder="e.g. Quarterly compressor service"
          sx={fieldSx}
          value={form.title}
          onChange={(e) => onFieldChange('title')(e.target.value)}
          error={titleError}
          helperText={titleError ? 'Title is required' : ' '}
        />
      </Box>

      {/* Asset + Type */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel required>Asset</FieldLabel>
          <Select
            id="sw-asset"
            fullWidth
            size="small"
            displayEmpty
            sx={selectSx}
            value={form.assetId}
            onChange={(e) => onFieldChange('assetId')(e.target.value)}
            error={assetError}
            renderValue={(v) =>
              v ? (assets.find((a) => a.id === v)?.name ?? v) : 'Select asset'
            }
          >
            {assets.map((a) => (
              <MenuItem key={a.id} value={a.id} sx={{ fontSize: '0.85rem' }}>
                {a.name}
              </MenuItem>
            ))}
          </Select>
          {assetError && (
            <Box sx={{ fontSize: '0.75rem', color: 'error.main', mt: 0.5 }}>Asset is required</Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel required>Type</FieldLabel>
          <Select
            id="sw-type"
            fullWidth
            size="small"
            sx={selectSx}
            value={form.type}
            onChange={(e) => onFieldChange('type')(e.target.value)}
            error={typeError}
          >
            {WORK_ORDER_TYPES.map((t) => (
              <MenuItem key={t} value={t} sx={{ fontSize: '0.85rem' }}>
                {t}
              </MenuItem>
            ))}
          </Select>
          {typeError && (
            <Box sx={{ fontSize: '0.75rem', color: 'error.main', mt: 0.5 }}>Type is required</Box>
          )}
        </Grid>
      </Grid>

      {/* Priority + Status */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>Priority</FieldLabel>
          <Select
            id="sw-priority"
            fullWidth
            size="small"
            sx={selectSx}
            value={form.priority}
            onChange={(e) => onFieldChange('priority')(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p} sx={{ fontSize: '0.85rem' }}>
                <Chip
                  label={p}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: PRIORITY_COLORS[p],
                    bgcolor: `${PRIORITY_COLORS[p]}18`,
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>Status</FieldLabel>
          <Select
            id="sw-status"
            fullWidth
            size="small"
            sx={selectSx}
            value={form.status}
            onChange={(e) => onFieldChange('status')(e.target.value)}
          >
            {WORK_ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: '0.85rem' }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* Description */}
      <Box>
        <FieldLabel>Description</FieldLabel>
        <TextField
          id="sw-description"
          fullWidth
          size="small"
          multiline
          rows={4}
          placeholder="Scope of work, safety notes, parts needed…"
          sx={fieldSx}
          value={form.description}
          onChange={(e) => onFieldChange('description')(e.target.value)}
        />
      </Box>
    </SectionCard>
  );
}