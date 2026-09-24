import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import type { ScheduleWorkFormState } from '../../redux/maintenanceSlice';
import type { Employee } from '../../types/employee';
import type { LocationItem } from '../../types/location';
import { FieldLabel, SectionCard, SectionHeading, selectSx, fieldSx } from './FormHelpers';

export interface ScheduleAssignmentSectionProps {
  form: ScheduleWorkFormState;
  employees: Employee[];
  locations: LocationItem[];
  onFieldChange: (field: keyof ScheduleWorkFormState) => (value: string) => void;
  /** When true, required-but-empty fields show an error state. Set after a failed "Next". */
  showErrors?: boolean;
}

export default function ScheduleAssignmentSection({
  form,
  employees,
  locations,
  onFieldChange,
  showErrors = false,
}: ScheduleAssignmentSectionProps) {
  const dateError = showErrors && !form.scheduledDate;
  return (
    <SectionCard>
      <SectionHeading
        title="Schedule & assignment"
        subtitle="When it happens and who owns it."
      />

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel required>Scheduled date</FieldLabel>
          <TextField
            id="sw-date"
            fullWidth
            size="small"
            type="date"
            sx={fieldSx}
            value={form.scheduledDate}
            onChange={(e) => onFieldChange('scheduledDate')(e.target.value)}
            error={dateError}
            helperText={dateError ? 'Scheduled date is required' : ' '}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>Estimated downtime (hours)</FieldLabel>
          <TextField
            id="sw-downtime"
            fullWidth
            size="small"
            type="number"
            sx={fieldSx}
            slotProps={{ htmlInput: { min: 0, step: 0.5 } }}
            value={form.estimatedDowntimeHours}
            onChange={(e) => onFieldChange('estimatedDowntimeHours')(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>Technician</FieldLabel>
          <Select
            id="sw-technician"
            fullWidth
            size="small"
            displayEmpty
            sx={selectSx}
            value={form.technicianId}
            onChange={(e) => onFieldChange('technicianId')(e.target.value)}
            renderValue={(v) =>
              v ? (employees.find((e) => e.id === v)?.name ?? v) : 'Select technician'
            }
          >
            {employees.map((e) => (
              <MenuItem key={e.id} value={e.id} sx={{ fontSize: '0.85rem' }}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>Vendor</FieldLabel>
          <TextField
            id="sw-vendor"
            fullWidth
            size="small"
            placeholder="External vendor (optional)"
            sx={fieldSx}
            value={form.vendor}
            onChange={(e) => onFieldChange('vendor')(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>Location</FieldLabel>
          <Select
            id="sw-location"
            fullWidth
            size="small"
            displayEmpty
            sx={selectSx}
            value={form.locationId}
            onChange={(e) => onFieldChange('locationId')(e.target.value)}
            renderValue={(v) =>
              v ? (locations.find((l) => l.id === v)?.name ?? v) : 'Select location'
            }
          >
            {locations.map((l) => (
              <MenuItem key={l.id} value={l.id} sx={{ fontSize: '0.85rem' }}>
                {l.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>Estimated cost</FieldLabel>
          <TextField
            id="sw-cost"
            fullWidth
            size="small"
            type="number"
            sx={fieldSx}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            value={form.estimatedCost}
            onChange={(e) => onFieldChange('estimatedCost')(e.target.value)}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
}