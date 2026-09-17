import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  scheduleFormFieldChanged,
  scheduleFormReset,
  scheduleFormSubmitted,
  selectScheduleWorkForm,
  selectScheduleFormCanSubmit,
  type ScheduleWorkFormState,
} from '../redux/maintenanceSlice';
import { selectAllAssets } from '../redux/assetsSlice';
import { selectAllEmployeesList } from '../redux/employeesSlice';
import { selectAllLocations } from '../redux/locationsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import WorkOrderFormSection from '../components/schedule-work/WorkOrderFormSection';
import ScheduleAssignmentSection from '../components/schedule-work/ScheduleAssignmentSection';
import ScheduleWorkSidebar from '../components/schedule-work/ScheduleWorkSidebar';

export interface ScheduleWorkPageProps {
  organizationName?: string;
  onCancel: () => void;
}

/**
 * ScheduleWorkPage container component.
 * Manages breadcrumb setup and Redux dispatchers, delegating UI rendering to sub-components.
 */
export default function ScheduleWorkPage({
  organizationName = 'Atlas Industries',
  onCancel,
}: ScheduleWorkPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();

  const form = useAppSelector(selectScheduleWorkForm);
  const canSubmit = useAppSelector(selectScheduleFormCanSubmit);
  const assets = useAppSelector(selectAllAssets);
  const employees = useAppSelector(selectAllEmployeesList);
  const locations = useAppSelector(selectAllLocations);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, navId: 'dashboard' },
      { label: 'Maintenance', navId: 'maintenance' },
      { label: 'Schedule work' },
    ]);
    dispatch(scheduleFormReset());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form.isSuccess) {
      onCancel();
    }
  }, [form.isSuccess, onCancel]);

  const handleFieldChange =
    (key: keyof ScheduleWorkFormState) => (value: string) => {
      dispatch(scheduleFormFieldChanged({ field: key, value }));
    };

  const handleSubmit = () => {
    if (!canSubmit) return;
    dispatch(scheduleFormSubmitted());
  };

  return (
    <Box>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif', lineHeight: 1.2 }}
          >
            Schedule work
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            Create a work order and assign it to a technician or vendor.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', flexShrink: 0 }}>
          <AppButton
            id="schedule-work-cancel-btn"
            variant="outline"
            startIcon={<ArrowBackIcon />}
            onClick={onCancel}
          >
            Cancel
          </AppButton>
          <AppButton
            id="schedule-work-submit-btn"
            variant="default"
            startIcon={<BuildOutlinedIcon />}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Schedule
          </AppButton>
        </Box>
      </Box>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 480px', minWidth: 0 }}>
          <WorkOrderFormSection
            form={form}
            assets={assets}
            onFieldChange={handleFieldChange}
          />
          <ScheduleAssignmentSection
            form={form}
            employees={employees}
            locations={locations}
            onFieldChange={handleFieldChange}
          />
        </Box>

        <ScheduleWorkSidebar
          form={form}
          canSubmit={canSubmit}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </Box>
    </Box>
  );
}
