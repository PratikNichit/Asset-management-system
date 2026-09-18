import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import RepeatIcon from '@mui/icons-material/Repeat';
import type {
  RecurrenceOption,
  ScheduleWorkFormState,
  WorkOrderPriority,
} from '../../redux/maintenanceSlice';
import type { Asset } from '../../types/asset';
import type { Employee } from '../../types/employee';
import type { LocationItem } from '../../types/location';
import { FieldLabel, SectionCard, SectionHeading, SummaryRow, selectSx } from './FormHelpers';

const RECURRENCE_OPTIONS: RecurrenceOption[] = [
  'Does not repeat',
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Annually',
];

const PRIORITY_COLORS: Record<WorkOrderPriority, string> = {
  Low: '#64748B',
  Medium: '#2563EB',
  High: '#D97706',
  Critical: '#DC2626',
};

export interface ReviewSectionProps {
  form: ScheduleWorkFormState;
  assets: Asset[];
  employees: Employee[];
  locations: LocationItem[];
  onFieldChange: (field: keyof ScheduleWorkFormState) => (value: string) => void;
}

export default function ReviewSection({
  form,
  assets,
  employees,
  locations,
  onFieldChange,
}: ReviewSectionProps) {
  const assetName = assets.find((a) => a.id === form.assetId)?.name;
  const technicianName = employees.find((e) => e.id === form.technicianId)?.name;
  const locationName = locations.find((l) => l.id === form.locationId)?.name;

  return (
    <>
      <SectionCard>
        <SectionHeading
          title="Review & confirm"
          subtitle="Double-check the details before scheduling."
        />

        <SummaryRow label="Title" value={form.title} />
        <SummaryRow label="Asset" value={assetName} />
        <SummaryRow label="Type" value={form.type} />
        <SummaryRow
          label="Priority"
          value={
            <Chip
              label={form.priority}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.72rem',
                fontWeight: 600,
                color: PRIORITY_COLORS[form.priority as WorkOrderPriority],
                bgcolor: `${PRIORITY_COLORS[form.priority as WorkOrderPriority]}18`,
              }}
            />
          }
        />
        <SummaryRow label="Status" value={form.status} />
        <SummaryRow label="Scheduled date" value={form.scheduledDate} />
        <SummaryRow
          label="Estimated downtime"
          value={form.estimatedDowntimeHours ? `${form.estimatedDowntimeHours} hrs` : undefined}
        />
        <SummaryRow label="Technician" value={technicianName} />
        <SummaryRow label="Vendor" value={form.vendor} />
        <SummaryRow label="Location" value={locationName} />
        <SummaryRow
          label="Estimated cost"
          value={form.estimatedCost ? `$${form.estimatedCost}` : undefined}
        />

        {form.description && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 0.5 }}>
              Description
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
              {form.description}
            </Typography>
          </Box>
        )}
      </SectionCard>

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
          sx={selectSx}
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
    </>
  );
}
