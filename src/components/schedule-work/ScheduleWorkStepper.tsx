import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';

export interface ScheduleWorkStepperProps {
  steps: string[];
  activeStep: number;
  stepValid: boolean[];
  onStepClick: (index: number) => void;
}

export default function ScheduleWorkStepper({
  steps,
  activeStep,
  stepValid,
  onStepClick,
}: ScheduleWorkStepperProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        mb: 3,
        px: 1,
      }}
    >
      {steps.map((label, i) => {
        const isActive = i === activeStep;
        const isComplete = i < activeStep && stepValid[i];
        const isReachable =
          i <= activeStep || stepValid.slice(0, i).every(Boolean);
        const isLast = i === steps.length - 1;

        return (
          <Box
            key={label}
            sx={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? '0 0 auto' : 1 }}
          >
            {/* Step node + label */}
            <Box
              onClick={() => isReachable && onStepClick(i)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isReachable ? 'pointer' : 'default',
                opacity: isReachable ? 1 : 0.45,
                minWidth: 80,
                userSelect: 'none',
              }}
            >
              {/* Circle */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  fontFamily: '"Manrope", sans-serif',
                  transition: 'all 0.2s ease',
                  bgcolor: isComplete
                    ? 'success.main'
                    : isActive
                    ? 'primary.main'
                    : (theme) =>
                        theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
                  color: isComplete || isActive ? '#fff' : 'text.disabled',
                  boxShadow: isActive
                    ? (theme) =>
                        `0 0 0 4px ${
                          theme.palette.mode === 'light'
                            ? 'rgba(109,93,246,0.15)'
                            : 'rgba(109,93,246,0.25)'
                        }`
                    : 'none',
                }}
              >
                {isComplete ? <CheckIcon sx={{ fontSize: 16 }} /> : i + 1}
              </Box>

              {/* Label */}
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? 'primary.main'
                    : isComplete
                    ? 'success.main'
                    : 'text.secondary',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  fontFamily: '"Manrope", sans-serif',
                  transition: 'color 0.2s ease',
                }}
              >
                {label}
              </Typography>
            </Box>

            {/* Connector line (not after last step) */}
            {!isLast && (
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  mt: '17px',
                  mx: 1,
                  borderRadius: 1,
                  bgcolor: isComplete
                    ? 'success.main'
                    : (theme) =>
                        theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
                  transition: 'background-color 0.3s ease',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
