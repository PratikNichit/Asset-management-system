import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// ─── Types ───────────────────────────────────────────────────────────────────

export type StatCardTrendDirection = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  /** Main metric label. */
  label: string;
  /** Primary numeric/string value to display. */
  value: string | number;
  /** Icon element rendered in the top-right avatar circle. */
  icon: React.ReactNode;
  /**
   * Background colour for the icon avatar circle.
   * Accepts any CSS colour string.
   */
  iconBgColor?: string;
  /**
   * Trend percentage text, e.g. "4.2%".
   * Shown with an up/down arrow when provided.
   */
  trendValue?: string;
  /** Direction of the trend arrow. @default 'up' */
  trendDirection?: StatCardTrendDirection;
  /** Small subtitle below the trend badge, e.g. "vs last month". */
  trendLabel?: string;
  /** Optional secondary note shown below the value, e.g. "next 90 days". */
  note?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * StatCard — compact metric summary card.
 *
 * Displays a KPI value, icon, and optional trend badge.
 * Used in the dashboard header row.
 *
 * @example
 * <StatCard
 *   label="Total assets"
 *   value={2148}
 *   icon={<InventoryIcon />}
 *   iconBgColor="#5159D71A"
 *   trendValue="4.2%"
 *   trendDirection="up"
 *   trendLabel="vs last month"
 * />
 */
export default function StatCard({
  label,
  value,
  icon,
  iconBgColor,
  trendValue,
  trendDirection = 'up',
  trendLabel,
  note,
}: StatCardProps) {
  const theme = useTheme();

  const trendColor =
    trendDirection === 'up'
      ? theme.palette.success.main
      : trendDirection === 'down'
        ? theme.palette.error.main
        : theme.palette.text.secondary;

  const TrendIcon = trendDirection === 'down' ? TrendingDownIcon : TrendingUpIcon;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        border: `1px solid ${theme.palette.customColors.borderLight}`,
        bgcolor: theme.palette.customColors.white,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        flex: 1,
        minWidth: 130,
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: `0 4px 16px ${theme.palette.customColors.borderLight}80`,
        },
      }}
    >
      {/* ── Top row: label + icon ─────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'text.secondary',
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: iconBgColor ?? theme.palette.customColors.primaryTransparent,
            borderRadius: 1.5,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { fontSize: 18 } }}>
            {icon}
          </Box>
        </Avatar>
      </Box>

      {/* ── Value ─────────────────────────────────────────────────────────── */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontWeight: 700,
          fontSize: '1.875rem',
          lineHeight: 1,
          color: 'text.primary',
        }}
      >
        {value}
      </Typography>

      {/* ── Note (e.g. "next 90 days") ────────────────────────────────────── */}
      {note && (
        <Typography variant="caption" sx={{ fontSize: '0.775rem', color: 'text.secondary' }}>
          {note}
        </Typography>
      )}

      {/* ── Trend badge ───────────────────────────────────────────────────── */}
      {trendValue && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.25,
              bgcolor: trendDirection === 'up'
                ? theme.palette.customColors.successTransparent
                : trendDirection === 'down'
                  ? theme.palette.customColors.errorTransparent
                  : theme.palette.customColors.bgNeutral,
              color: trendColor,
              borderRadius: 1,
              px: 0.5,
              py: 0.125,
            }}
          >
            <TrendIcon sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1 }}>
              {trendValue}
            </Typography>
          </Box>
          {trendLabel && (
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {trendLabel}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}
