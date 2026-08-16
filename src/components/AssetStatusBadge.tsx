import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import CircleIcon from '@mui/icons-material/Circle';
import type { AssetStatus } from '../types/asset';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AssetStatusBadgeProps {
  status: AssetStatus;
}

// ─── Config map ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AssetStatus,
  { label: string; bgKey: keyof ReturnType<typeof useStatusColors>; dotColor: string }
> = {
  'In Use':      { label: 'In Use',      bgKey: 'successBg', dotColor: '#20B46B' },
  'Available':   { label: 'Available',   bgKey: 'infoBg',    dotColor: '#009BD8' },
  'Maintenance': { label: 'Maintenance', bgKey: 'warningBg', dotColor: '#EFA831' },
  'Retired':     { label: 'Retired',     bgKey: 'neutralBg', dotColor: '#8C929F' },
};

function useStatusColors() {
  const theme = useTheme();
  return {
    successBg: theme.palette.customColors.successTransparent,
    infoBg:    theme.palette.customColors.infoTransparent,
    warningBg: theme.palette.customColors.warningTransparent,
    neutralBg: theme.palette.customColors.bgNeutral,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * AssetStatusBadge — compact pill showing an asset's current status.
 *
 * @example
 * <AssetStatusBadge status="In Use" />
 */
export default function AssetStatusBadge({ status }: AssetStatusBadgeProps) {
  const colors  = useStatusColors();
  const config  = STATUS_CONFIG[status];
  const bgColor = colors[config.bgKey];

  return (
    <Chip
      size="small"
      icon={
        <CircleIcon sx={{ fontSize: '8px !important', color: `${config.dotColor} !important` }} />
      }
      label={config.label}
      sx={{
        bgcolor: bgColor,
        color: config.dotColor,
        fontWeight: 600,
        fontSize: '0.72rem',
        height: 24,
        borderRadius: '999px',
        border: 'none',
        '& .MuiChip-icon': { ml: '6px', mr: '-4px' },
      }}
    />
  );
}
