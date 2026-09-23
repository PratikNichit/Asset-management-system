import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
import type { SxProps, Theme } from '@mui/material/styles';
import WorkOrderFormSection from '../components/schedule-work/WorkOrderFormSection';
import ScheduleAssignmentSection from '../components/schedule-work/ScheduleAssignmentSection';
import ReviewSection from '../components/schedule-work/ReviewSection';
import ScheduleWorkSidebar from '../components/schedule-work/ScheduleWorkSidebar';

export interface ScheduleWorkPageProps {
  organizationName?: string;
  /** Optional override for cancel behavior; defaults to navigate('/maintenance') */
  onCancel?: () => void;
}

const STEPS = ['Work order', 'Schedule & assignment', 'Review & confirm'];

const outlineButtonSx: SxProps<Theme> = {
  borderColor: 'customColors.borderLight',
  color: 'text.primary',
};

/**
 * ScheduleWorkPage container component.
 * Manages breadcrumb setup, wizard step state, and Redux dispatchers,
 * delegating UI rendering to sub-components.
 */
export default function ScheduleWorkPage({
  organizationName = 'Atlas Industries',
  onCancel,
}: ScheduleWorkPageProps) {
  const navigate = useNavigate();
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/maintenance');
  };

  const form = useAppSelector(selectScheduleWorkForm);
  const canSubmit = useAppSelector(selectScheduleFormCanSubmit);
  const assets = useAppSelector(selectAllAssets);
  const employees = useAppSelector(selectAllEmployeesList);
  const locations = useAppSelector(selectAllLocations);

  const [activeStep, setActiveStep] = useState(0);
  // Tracks whether "Next" was pressed on a step while it was invalid, so we
  // only show red error states after the user has actually tried to move on
  // (rather than on first render, which reads as broken/aggressive).
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Maintenance', path: '/maintenance' },
      { label: 'Schedule work' },
    ]);
    dispatch(scheduleFormReset());
    setActiveStep(0);
    setAttemptedStep(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form.isSuccess) {
      handleCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.isSuccess]);

  const handleFieldChange =
    (key: keyof ScheduleWorkFormState) => (value: string) => {
      dispatch(scheduleFormFieldChanged({ field: key, value }));
    };

  const handleSubmit = () => {
    if (!canSubmit) return;
    dispatch(scheduleFormSubmitted());
  };

  // Per-step validity, independent of the redux-level `canSubmit` (which
  // reflects the whole form). Used to gate "Next" and drive the sidebar's
  // progress indicator.
  const stepValid = useMemo(
    () => [
      Boolean(form.title?.trim()) && Boolean(form.assetId) && Boolean(form.type),
      Boolean(form.scheduledDate),
      canSubmit,
    ],
    [form.title, form.assetId, form.type, form.scheduledDate, canSubmit]
  );

  const isLastStep = activeStep === STEPS.length - 1;

  const goToStep = (index: number) => {
    const isReachable = index <= activeStep || stepValid.slice(0, index).every(Boolean);
    if (!isReachable) return;
    setActiveStep(index);
    setAttemptedStep(null);
  };

  const handleNext = () => {
    if (!stepValid[activeStep]) {
      setAttemptedStep(activeStep);
      return;
    }
    setAttemptedStep(null);
    setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setAttemptedStep(null);
    setActiveStep((s) => Math.max(s - 1, 0));
  };

  const handlePrimaryAction = () => {
    if (isLastStep) handleSubmit();
    else handleNext();
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
        {/* Left side: back button + title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <AppButton
            id="schedule-work-cancel-btn"
            variant="outline"
            size="icon"
            onClick={handleCancel}
            aria-label="Back to maintenance"
            sx={outlineButtonSx}
          >
            <ArrowBackIcon fontSize="small" />
          </AppButton>
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
              Step {activeStep + 1} of {STEPS.length}: {STEPS[activeStep]}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 480px', minWidth: 0 }}>
          {activeStep === 0 && (
            <WorkOrderFormSection
              form={form}
              assets={assets}
              onFieldChange={handleFieldChange}
              showErrors={attemptedStep === 0}
            />
          )}

          {activeStep === 1 && (
            <ScheduleAssignmentSection
              form={form}
              employees={employees}
              locations={locations}
              onFieldChange={handleFieldChange}
              showErrors={attemptedStep === 1}
            />
          )}

          {activeStep === 2 && (
            <ReviewSection
              form={form}
              assets={assets}
              employees={employees}
              locations={locations}
              onFieldChange={handleFieldChange}
            />
          )}

          {/* Step navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <AppButton
              id="schedule-work-back-btn"
              variant="ghost"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </AppButton>
            <AppButton
              id="schedule-work-primary-btn"
              variant="default"
              endIcon={isLastStep ? undefined : <ArrowForwardIcon />}
              startIcon={isLastStep ? <BuildOutlinedIcon /> : undefined}
              onClick={handlePrimaryAction}
              disabled={isLastStep && !canSubmit}
            >
              {isLastStep ? 'Schedule work' : 'Next'}
            </AppButton>
          </Box>
        </Box>

        <ScheduleWorkSidebar
          steps={STEPS}
          activeStep={activeStep}
          stepValid={stepValid}
          onStepClick={goToStep}
        />
      </Box>
    </Box>
  );
}