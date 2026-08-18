import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SummaryCardProps {
  /** All-caps short label displayed above the content, e.g. "ASSET" */
  label: string;
  /** Bold primary line, e.g. asset or employee name */
  primary: string;
  /** Smaller secondary line, e.g. asset code or department */
  secondary: string;
  /** Optional click handler for summary card */
  onClick?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Compact labeled summary card.
 * Pure presentational — renders a label, a bold primary line, and a secondary line
 * inside a lightly bordered box. Reusable for any domain summary (asset, employee, etc.).
 */
export default function SummaryCard({ label, primary, secondary, onClick }: SummaryCardProps) {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        border: `1px solid ${theme.palette.customColors.borderLight}`,
        borderRadius: 2,
        p: 1.5,
        bgcolor: theme.palette.customColors.bgLight,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        '&:hover': onClick
          ? { borderColor: theme.palette.primary.main, bgcolor: 'background.paper' }
          : {},
      }}
    >
      <Typography
        sx={{
          fontSize: '0.68rem',
          fontWeight: 600,
          color: 'text.secondary',
          letterSpacing: '0.06em',
          mb: 0.4,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
        {primary}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
        {secondary}
      </Typography>
    </Box>
  );
}
