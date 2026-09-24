import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { SectionCard } from './FormHelpers';

export interface ScheduleWorkSidebarProps {
  steps: string[];
  activeStep: number;
  /** Whether each step's required fields are currently satisfied. */
  stepValid: boolean[];
  onStepClick: (index: number) => void;
}

export default function ScheduleWorkSidebar({
  steps,
  activeStep,
  stepValid,
  onStepClick,
}: ScheduleWorkSidebarProps) {
  return (
    <Box sx={{ flex: '0 0 280px', minWidth: 260, position: 'sticky', top: 16 }}>
      {/* Step progress */}
      <SectionCard>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 1.75 }}>Progress</Typography>

        {steps.map((label, i) => {
          const isActive = i === activeStep;
          const isComplete = i < activeStep && stepValid[i];
          // A step can be jumped to directly if it's already been reached,
          // or if every step before it is valid.
          const isReachable = i <= activeStep || stepValid.slice(0, i).every(Boolean);

          return (
            <Box
              key={label}
              onClick={() => isReachable && onStepClick(i)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.75,
                cursor: isReachable ? 'pointer' : 'default',
                opacity: isReachable ? 1 : 0.5,
                borderRadius: 1,
                px: 0.5,
                '&:hover': isReachable ? { bgcolor: 'action.hover' } : undefined,
              }}
            >
              {isComplete ? (
                <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
              ) : (
                <RadioButtonUncheckedIcon
                  sx={{ fontSize: 18, color: isActive ? 'primary.main' : 'text.disabled' }}
                />
              )}
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'text.primary' : 'text.secondary',
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
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
    </Box>
  );
}