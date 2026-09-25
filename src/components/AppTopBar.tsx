import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddIcon from '@mui/icons-material/Add';
import AppButton from './AppButton';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleTheme, selectThemeMode } from '../redux/themeSlice';
import { selectAuthUser } from '../redux/authSlice';
import { selectAllAssets } from '../redux/assetsSlice';
import { selectAllEmployeesList, setSelectedEmployeeId } from '../redux/employeesSlice';
import { useLayout } from '../hooks/useLayout';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface AppTopBarProps {
  /** Array of breadcrumb labels, left to right. @default ['Atlas Industries', 'Asset Management'] */
  breadcrumbs?: string[];
  /** Optional route path per crumb — index matches breadcrumbs array. Non-last crumbs with a path become clickable. */
  breadcrumbPaths?: (string | undefined)[];
  /** Callback for the "+ New asset" button click. */
  onNewAsset?: () => void;
}

const MAX_RESULTS_PER_GROUP = 5;

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppTopBar({
  breadcrumbs = ['Atlas Industries', 'Asset Management'],
  breadcrumbPaths = [],
  onNewAsset,
}: AppTopBarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const authUser = useAppSelector(selectAuthUser);
  const border = `1px solid ${theme.palette.customColors.borderLight}`;

  const assets = useAppSelector(selectAllAssets);
  const employees = useAppSelector(selectAllEmployeesList);
  const { navigateToAsset } = useLayout();

  // ── Search state ──────────────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K focuses the search box from anywhere on the page.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setResultsOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const q = query.trim().toLowerCase();

  const matchedAssets = useMemo(() => {
    if (!q) return [];
    return assets
      .filter((a) =>
        a.name?.toLowerCase().includes(q) ||
        a.code?.toLowerCase().includes(q) ||
        a.serial?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.department?.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS_PER_GROUP);
  }, [assets, q]);

  const matchedEmployees = useMemo(() => {
    if (!q) return [];
    return employees
      .filter((e: any) =>
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS_PER_GROUP);
  }, [employees, q]);

  const hasResults = matchedAssets.length > 0 || matchedEmployees.length > 0;
  const showDropdown = resultsOpen && q.length > 0;

  const closeSearch = () => {
    setResultsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    searchInputRef.current?.focus();
  };

  const goToAsset = (assetId: string) => {
    navigateToAsset(assetId);
    setQuery('');
    closeSearch();
  };

  const goToEmployee = (employeeId: string) => {
    dispatch(setSelectedEmployeeId(employeeId));
    navigate('/employees');
    setQuery('');
    closeSearch();
  };

  // Jump to the first result on Enter.
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (matchedAssets.length > 0) goToAsset(matchedAssets[0].id);
    else if (matchedEmployees.length > 0) goToEmployee((matchedEmployees[0] as any).id);
  };

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
          const path = breadcrumbPaths[i];
          const isClickable = !isLast && !!path;

          return (
            <Typography
              key={`${crumb}-${i}`}
              component={isClickable ? 'button' : 'span'}
              variant="body2"
              onClick={isClickable ? () => navigate(path!) : undefined}
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
      <ClickAwayListener onClickAway={closeSearch}>
        <Box sx={{ position: 'relative', width: 320 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: theme.palette.customColors.bgNeutral,
              borderRadius: 2,
              px: 2,
              py: 0.75,
              width: '100%',
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
              inputRef={searchInputRef}
              placeholder="Search assets, people…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setResultsOpen(true); }}
              onFocus={() => setResultsOpen(true)}
              onKeyDown={handleSearchKeyDown}
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
            {query ? (
              <IconButton size="small" onClick={clearSearch} aria-label="clear search" sx={{ p: 0.25, color: 'text.secondary' }}>
                <CloseIcon sx={{ fontSize: 15 }} />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', opacity: 0.6, bgcolor: theme.palette.customColors.bgNeutralDark, px: 0.5, py: 0.1, borderRadius: 0.5, fontFamily: 'monospace' }}>⌘</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', opacity: 0.6, bgcolor: theme.palette.customColors.bgNeutralDark, px: 0.5, py: 0.1, borderRadius: 0.5, fontFamily: 'monospace' }}>K</Typography>
              </Box>
            )}
          </Box>

          {/* ── Results dropdown ──────────────────────────────────────────── */}
          {showDropdown && (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                borderRadius: 2,
                borderColor: theme.palette.customColors.borderLight,
                bgcolor: 'background.paper',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                maxHeight: 420,
                overflowY: 'auto',
                zIndex: theme.zIndex.appBar + 10,
              }}
            >
              {!hasResults ? (
                <Box sx={{ px: 2, py: 2.5, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No matches for "{query}"
                  </Typography>
                </Box>
              ) : (
                <List dense disablePadding>
                  {matchedAssets.length > 0 && (
                    <ListSubheader sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.4, lineHeight: '28px', color: 'text.secondary', bgcolor: 'background.paper' }}>
                      ASSETS
                    </ListSubheader>
                  )}
                  {matchedAssets.map((asset) => (
                    <ListItemButton key={asset.id} onClick={() => goToAsset(asset.id)} sx={{ px: 2, py: 0.9 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: `${theme.palette.primary.main}1A`, color: 'primary.main' }}>
                          <Inventory2OutlinedIcon sx={{ fontSize: 15 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={asset.name}
                        secondary={[asset.code, asset.department].filter(Boolean).join(' · ')}
                        slotProps={{
                          primary: { sx: { fontSize: '0.85rem', fontWeight: 500 } },
                          secondary: { sx: { fontSize: '0.75rem' } },
                        }}
                      />
                    </ListItemButton>
                  ))}

                  {matchedEmployees.length > 0 && (
                    <ListSubheader sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.4, lineHeight: '28px', color: 'text.secondary', bgcolor: 'background.paper' }}>
                      PEOPLE
                    </ListSubheader>
                  )}
                  {matchedEmployees.map((employee: any) => (
                    <ListItemButton key={employee.id} onClick={() => goToEmployee(employee.id)} sx={{ px: 2, py: 0.9 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: `${theme.palette.primary.main}1A`, color: 'primary.main' }}>
                          <PersonOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={employee.name}
                        secondary={[employee.role, employee.email].filter(Boolean).join(' · ')}
                        slotProps={{
                          primary: { sx: { fontSize: '0.85rem', fontWeight: 500 } },
                          secondary: { sx: { fontSize: '0.75rem' } },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Paper>
          )}
        </Box>
      </ClickAwayListener>

      {/* ── Action icons ───────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          aria-label="notifications"
          onClick={() => navigate('/notifications')}
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
          onClick={() => navigate('/settings')}
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: theme.palette.customColors.bgNeutral } }}
        >
          <SettingsOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── User avatar ────────────────────────────────────────────────────── */}
      <Tooltip title={authUser?.email || authUser?.name || 'Account'}>
        <Avatar
          onClick={() => navigate('/settings')}
          sx={{
            width: 34,
            height: 34,
            bgcolor: theme.palette.primary.main,
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'opacity 0.2s ease',
            '&:hover': { opacity: 0.9 },
          }}
        >
          {userInitial(authUser)}
        </Avatar>
      </Tooltip>

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

function userInitial(authUser: { email?: string | null; name?: string | null } | null | undefined) {
  const identifier = authUser?.email || authUser?.name || '';
  const firstChar = identifier.trim().charAt(0);
  return firstChar ? firstChar.toUpperCase() : 'U';
}