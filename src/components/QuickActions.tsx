import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface QuickActionsProps {
  /** Override the default set of action items. */
  actions?: QuickActionItem[];
}

// ─── Default actions ─────────────────────────────────────────────────────────

const DEFAULT_ACTIONS: QuickActionItem[] = [
  { id: 'add-asset',      label: 'Add new asset',        icon: <AddCircleOutlinedIcon fontSize="small" /> },
  { id: 'assign',         label: 'Assign to employee',   icon: <AssignmentIndOutlinedIcon fontSize="small" /> },
  { id: 'maintenance',    label: 'Schedule maintenance', icon: <BuildOutlinedIcon fontSize="small" /> },
  { id: 'qr',             label: 'Generate QR labels',   icon: <QrCodeOutlinedIcon fontSize="small" /> },
];

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * QuickActions — panel of frequently used one-click actions.
 *
 * Each row shows an icon, label, and a right-arrow chevron.
 * Tapping any row fires its optional `onClick` handler.
 *
 * @example
 * <QuickActions />
 *
 * @example
 * <QuickActions actions={[{ id: 'export', label: 'Export CSV', icon: <DownloadIcon /> }]} />
 */
export default function QuickActions({ actions = DEFAULT_ACTIONS }: QuickActionsProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: `1px solid ${theme.palette.customColors.borderLight}`,
        bgcolor: theme.palette.customColors.white,
        overflow: 'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: '"Manrope", sans-serif' }}
        >
          Quick actions
        </Typography>
      </Box>

      {/* ── Action rows ────────────────────────────────────────────────────── */}
      {actions.map((action, index) => (
        <Box
          key={action.id}
          onClick={action.onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            cursor: 'pointer',
            borderTop: index === 0 ? `1px solid ${theme.palette.customColors.borderLight}` : `1px solid ${theme.palette.customColors.borderLight}`,
            transition: 'background-color 0.15s ease',
            '&:hover': {
              bgcolor: theme.palette.customColors.bgLight,
              '& .qa-arrow': { transform: 'translateX(3px)', color: theme.palette.primary.main },
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 1.5,
              bgcolor: theme.palette.customColors.bgNeutral,
              color: theme.palette.text.secondary,
              flexShrink: 0,
            }}
          >
            {action.icon}
          </Box>
          <Typography
            variant="body2"
            sx={{ flex: 1, fontSize: '0.8125rem', fontWeight: 400 }}
          >
            {action.label}
          </Typography>
          <ArrowForwardIcon
            className="qa-arrow"
            sx={{
              fontSize: 16,
              color: 'text.secondary',
              transition: 'transform 0.15s ease, color 0.15s ease',
              flexShrink: 0,
            }}
          />
        </Box>
      ))}
    </Paper>
  );
}
