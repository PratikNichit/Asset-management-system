import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StepHeaderProps {
  step: number;
  icon: ReactNode;
  label: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders a numbered step badge with an icon and a label.
 * Pure presentational — no data dependencies.
 */
export default function StepHeader({ step, icon, label }: StepHeaderProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: theme.palette.customColors.primaryTransparent,
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '& svg': { fontSize: 17 },
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'text.primary' }}>
        {step}. {label}
      </Typography>
    </Box>
  );
}
