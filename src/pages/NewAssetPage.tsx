import { useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAllCategories } from '../redux/categoriesSlice';
import { selectAllDepartments } from '../redux/departmentsSlice';
import { selectAllLocations } from '../redux/locationsSlice';
import { selectAllEmployeesList } from '../redux/employeesSlice';
import { addAssetAsync } from '../redux/assetsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import type { Asset } from '../types/asset';

import { useNewAssetForm, STEPS } from '../hooks/useNewAssetForm';
import BasicDetailsStep from '../components/NewAsset/BasicDetailsStep';
import PurchaseWarrantyStep from '../components/NewAsset/PurchaseWarrantyStep';
import AssignmentStep from '../components/NewAsset/AssignmentStep';
import MediaDescriptionStep from '../components/NewAsset/MediaDescriptionStep';
import ReviewStep from '../components/NewAsset/ReviewStep';

export interface NewAssetPageProps {
  organizationName?: string;
  onCancel?: () => void;
  onSuccess?: (newAsset: Asset) => void;
}

const DEFAULT_CATEGORIES = [
  'Laptops',
  'Monitors',
  'Machines',
  'Molds',
  'Forklifts',
  'Peripherals',
  'Furniture',
  'Software Licenses',
];

// ── Custom stepper connector & icon so it matches the Atlas purple theme ────
const AtlasConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
    left: 'calc(-50% + 18px)',
    right: 'calc(50% + 18px)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}, &.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]:
  {
    borderColor: theme.palette.primary.main,
  },
}));

function AtlasStepIcon({ active, completed, icon }: { active?: boolean; completed?: boolean; icon: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 700,
        bgcolor: completed || active ? 'primary.main' : 'background.paper',
        color: completed || active ? '#fff' : 'text.secondary',
        border: completed || active ? 'none' : '2px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 16 }} /> : icon}
    </Box>
  );
}

export default function NewAssetPage({
  organizationName = 'Atlas',
  onCancel,
  onSuccess,
}: NewAssetPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const reduxCategories = useAppSelector(selectAllCategories);
  const reduxDepartments = useAppSelector(selectAllDepartments);
  const reduxLocations = useAppSelector(selectAllLocations);
  const reduxEmployees = useAppSelector(selectAllEmployeesList);

  const categoriesList = reduxCategories.length > 0 ? reduxCategories.map((c) => c.name) : DEFAULT_CATEGORIES;
  const departmentsList = reduxDepartments.length > 0 ? reduxDepartments.map((d) => d.name) : ['Engineering', 'Design', 'Operations', 'Production', 'Quality', 'Maintenance', 'Admin', 'Finance'];
  const locationsList = reduxLocations.length > 0 ? reduxLocations.map((l) => l.name) : ['HQ — Bengaluru', 'Plant 1 — Pune', 'Warehouse A', 'R&D Lab'];

  // Dispatch the new asset to Redux (and Supabase if configured), then navigate away.
  const handleSuccess = useCallback(
    async (newAsset: Asset) => {
      await dispatch(addAssetAsync(newAsset));
      if (onSuccess) {
        onSuccess(newAsset);
      } else {
        navigate('/assets', { replace: true });
      }
    },
    [dispatch, navigate, onSuccess],
  );

  const handleCancelOrBack = useCallback(() => {
    if (onCancel) onCancel();
    else navigate('/assets', { replace: true });
  }, [onCancel, navigate]);

  const form = useNewAssetForm(handleSuccess, handleCancelOrBack);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Assets', path: '/assets' },
      { label: 'New Asset' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, maxWidth: 880, mx: 'auto', width: '100%' }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem', color: 'text.primary', letterSpacing: '-0.02em' }}
          >
            New asset
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.9rem', color: 'text.secondary', fontFamily: '"Manrope", sans-serif' }}>
            Step {form.state.activeStep + 1} of {STEPS.length} — {STEPS[form.state.activeStep].helper}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onCancel && (
            <AppButton
              variant="ghost"
              size="sm"
              onClick={onCancel}
              sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', fontFamily: '"Manrope", sans-serif', px: 1.5 }}
            >
              Cancel
            </AppButton>
          )}
          <AppButton
            variant="outline"
            size="sm"
            onClick={form.handlers.handleSaveDraft}
            sx={{ borderColor: 'divider', color: 'text.primary', fontWeight: 600, fontFamily: '"Manrope", sans-serif', textTransform: 'none', px: 2, py: 0.9 }}
          >
            Save as draft
          </AppButton>
        </Box>
      </Box>

      {/* ── Stepper ─────────────────────────────────────────────────────── */}
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3.5, borderColor: 'divider', bgcolor: 'background.paper', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)' }}
      >
        <Stepper activeStep={form.state.activeStep} alternativeLabel connector={<AtlasConnector />}>
          {STEPS.map((step, idx) => (
            <Step key={step.label} completed={form.state.furthestStep > idx}>
              <StepLabel
                slots={{ stepIcon: (props) => <AtlasStepIcon {...props} icon={idx + 1} /> }}
                onClick={() => form.handlers.goToStep(idx)}
                sx={{
                  cursor: idx <= form.state.furthestStep ? 'pointer' : 'default',
                  '& .MuiStepLabel-label': {
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    fontFamily: '"Manrope", sans-serif',
                    mt: 0.75,
                    '&.Mui-active': { color: 'text.primary' },
                    '&.Mui-completed': { color: 'text.primary' },
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* ── Step content ────────────────────────────────────────────────── */}
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3.5, borderColor: 'divider', bgcolor: 'background.paper', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)', display: 'flex', flexDirection: 'column', gap: 2.5, minHeight: 360 }}
      >
        {form.state.activeStep === 0 && (
          <BasicDetailsStep state={form.state} setters={form.setters} handlers={form.handlers} categoriesList={categoriesList} />
        )}
        {form.state.activeStep === 1 && (
          <PurchaseWarrantyStep state={form.state} setters={form.setters} handlers={form.handlers} />
        )}
        {form.state.activeStep === 2 && (
          <AssignmentStep state={form.state} setters={form.setters} departmentsList={departmentsList} locationsList={locationsList} employeesList={reduxEmployees} />
        )}
        {form.state.activeStep === 3 && (
          <MediaDescriptionStep state={form.state} setters={form.setters} refs={form.refs} handlers={form.handlers} />
        )}
        {form.state.activeStep === 4 && (
          <ReviewStep state={form.state} handlers={form.handlers} />
        )}
      </Paper>

      {/* ── Footer navigation ──────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppButton
          variant="ghost"
          size="sm"
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={form.handlers.handleBack}
          disabled={form.state.activeStep === 0}
          sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', fontFamily: '"Manrope", sans-serif', px: 1.5, visibility: form.state.activeStep === 0 ? 'hidden' : 'visible' }}
        >
          Back
        </AppButton>

        {form.state.activeStep < STEPS.length - 1 ? (
          <AppButton
            variant="default"
            size="sm"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
            onClick={form.handlers.handleNext}
            sx={{ bgcolor: 'primary.main', borderRadius: '10px', px: 2.4, py: 1, fontWeight: 600, fontFamily: '"Manrope", sans-serif', textTransform: 'none', boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Continue
          </AppButton>
        ) : (
          <AppButton
            variant="default"
            size="sm"
            onClick={form.handlers.handleCreate}
            sx={{ bgcolor: 'primary.main', borderRadius: '10px', px: 2.4, py: 1, fontWeight: 600, fontFamily: '"Manrope", sans-serif', textTransform: 'none', boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Create asset
          </AppButton>
        )}
      </Box>

      {/* Snackbar notification toast */}
      <Snackbar open={Boolean(form.state.toastMessage)} autoHideDuration={4000} onClose={() => form.setters.setToastMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => form.setters.setToastMessage(null)} severity="info" sx={{ width: '100%' }}>
          {form.state.toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}