import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddIcon from '@mui/icons-material/Add';
import AppButton from './AppButton';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleTheme, selectThemeMode } from '../redux/themeSlice';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface AppTopBarProps {
  /** Array of breadcrumb labels, left to right. @default ['Atlas Industries', 'Asset Management'] */
  breadcrumbs?: string[];
  /** Optional navId per crumb — index matches breadcrumbs array. Non-last crumbs with a navId become clickable. */
  breadcrumbNavIds?: (string | undefined)[];
  /** Called with the navId when a clickable breadcrumb is clicked. */
  onBreadcrumbClick?: (navId: string) => void;
  /** Callback for the "+ New asset" button click. */
  onNewAsset?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppTopBar({
  breadcrumbs = ['Atlas Industries', 'Asset Management'],
  breadcrumbNavIds = [],
  onBreadcrumbClick,
  onNewAsset,
}: AppTopBarProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const border = `1px solid ${theme.palette.customColors.borderLight}`;

  return (
    <Box
      component="header"
      sx={{
        height: 75,
        minHeight: 75,
        display: 'flex',
        alignItems: 'center',
        px: 3,
        gap: 2.5,
        bgcolor: theme.palette.customColors.white,
        borderBottom: border,
        flexShrink: 0,
      }}
    >
      {/* ── Breadcrumbs ────────────────────────────────────────────────────── */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          flexShrink: 0,
          '& .MuiBreadcrumbs-separator': { mx: 0.5 },
          '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' },
        }}
      >
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          const navId = breadcrumbNavIds[i];
          const isClickable = !isLast && !!navId;

          return (
            <Typography
              key={`${crumb}-${i}`}
              component={isClickable ? 'button' : 'span'}
              variant="body2"
              onClick={isClickable ? () => onBreadcrumbClick?.(navId) : undefined}
              sx={{
                all: isClickable ? 'unset' : undefined,
                fontSize: '0.875rem',
                fontWeight: isLast ? 500 : 400,
                color: isLast ? 'text.primary' : 'text.secondary',
                whiteSpace: 'nowrap',
                cursor: isClickable ? 'pointer' : 'default',
                userSelect: 'none',
                fontFamily: 'inherit',
                transition: 'color 0.15s ease',
                ...(isClickable && {
                  '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                  '&:focus-visible': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                    borderRadius: 1,
                  },
                }),
              }}
            >
              {crumb}
            </Typography>
          );
        })}
      </Breadcrumbs>

      {/* ── Spacer ─────────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1 }} />

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: theme.palette.customColors.bgNeutral,
          borderRadius: 2,
          px: 2,
          py: 0.75,
          width: 320,
          border: `1px solid transparent`,
          transition: 'all 0.15s ease',
          '&:focus-within': {
            border: `1px solid ${theme.palette.primary.main}40`,
            bgcolor: theme.palette.customColors.bgLight,
          },
        }}
      >
        <SearchIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
        <InputBase
          placeholder="Search assets, people, tags…"
          inputProps={{ 'aria-label': 'search' }}
          sx={{
            flex: 1,
            fontSize: '0.875rem',
            '& .MuiInputBase-input': {
              p: 0,
              '&::placeholder': { color: 'text.secondary', opacity: 0.75 },
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            flexShrink: 0,
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', opacity: 0.6, bgcolor: theme.palette.customColors.bgNeutralDark, px: 0.5, py: 0.1, borderRadius: 0.5, fontFamily: 'monospace' }}>⌘</Typography>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', opacity: 0.6, bgcolor: theme.palette.customColors.bgNeutralDark, px: 0.5, py: 0.1, borderRadius: 0.5, fontFamily: 'monospace' }}>K</Typography>
        </Box>
      </Box>

      {/* ── Action icons ───────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          aria-label="notifications"
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: theme.palette.customColors.bgNeutral } }}
        >
          <NotificationsOutlinedIcon fontSize="small" />
        </IconButton>

        {/* Theme Toggle Button */}
        <Tooltip title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton
            size="small"
            aria-label="toggle theme"
            onClick={() => dispatch(toggleTheme())}
            sx={{ color: 'text.secondary', '&:hover': { bgcolor: theme.palette.customColors.bgNeutral } }}
          >
            {themeMode === 'light' ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <IconButton
          size="small"
          aria-label="settings"
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: theme.palette.customColors.bgNeutral } }}
        >
          <SettingsOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── User avatar ────────────────────────────────────────────────────── */}
      <Avatar
        sx={{
          width: 34,
          height: 34,
          bgcolor: theme.palette.primary.main,
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        PS
      </Avatar>

      {/* ── New asset CTA ──────────────────────────────────────────────────── */}
      <AppButton
        variant="default"
        size="default"
        startIcon={<AddIcon />}
        onClick={onNewAsset}
        sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
      >
        New asset
      </AppButton>
    </Box>
  );
}
