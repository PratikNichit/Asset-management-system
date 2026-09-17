import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAppDispatch } from '../app/hooks';
import { signOut } from '../redux/authSlice';

// ─── Constants ────────────────────────────────────────────────────────────────
const EXPANDED_WIDTH = 300;
const COLLAPSED_WIDTH = 68;
const TRANSITION = 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem { id: string; label: string; icon: React.ReactNode; path: string; }
interface NavSection { sectionLabel: string; items: NavItem[]; }

// ─── Nav config ──────────────────────────────────────────────────────────────
const NAV_SECTIONS: NavSection[] = [
  {
    sectionLabel: 'WORKSPACE',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
      { id: 'assets', label: 'Assets', icon: <Inventory2OutlinedIcon />, path: '/assets' },
      { id: 'assign-asset', label: 'Assign asset', icon: <AssignmentIndOutlinedIcon />, path: '/assign-asset' },
      { id: 'maintenance', label: 'Maintenance', icon: <BuildOutlinedIcon />, path: '/maintenance' },
    ],
  },
  {
    sectionLabel: 'PEOPLE AND STRUCTURE',
    items: [
      { id: 'employees', label: 'Employees', icon: <PeopleOutlinedIcon />, path: '/employees' },
      { id: 'departments', label: 'Departments', icon: <ApartmentOutlinedIcon />, path: '/departments' },
      { id: 'locations', label: 'Locations', icon: <LocationOnOutlinedIcon />, path: '/locations' },
      { id: 'categories', label: 'Categories', icon: <CategoryOutlinedIcon />, path: '/categories' },
    ],
  },
  {
    sectionLabel: 'INSIGHTS',
    items: [
      { id: 'reports', label: 'Reports', icon: <BarChartOutlinedIcon />, path: '/reports' },
      { id: 'notifications', label: 'Notifications', icon: <NotificationsOutlinedIcon />, path: '/notifications' },
      { id: 'settings', label: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' },
    ],
  },
];

// ─── Props ───────────────────────────────────────────────────────────────────
export interface AppSidebarProps {
  defaultCollapsed?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AppSidebar({ defaultCollapsed = false }: AppSidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  /** Derive the active nav item from the current URL path */
  const activeId = NAV_SECTIONS.flatMap((s) => s.items).find((item) => {
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  })?.id ?? 'dashboard';

  async function handleLogout() {
    await dispatch(signOut());
    navigate('/login');
  }

  const border = `1px solid ${theme.palette.customColors.borderLight}`;
  const w = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <Box
      component="nav"
      sx={{
        width: w,
        minWidth: w,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.customColors.bgLight,
        borderRight: border,
        overflow: 'visible',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        transition: TRANSITION,
      }}
    >
      {/* ── Workspace header ─────────────────────────────────────────────── */}
      <Box
        sx={{
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: border,
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': { bgcolor: theme.palette.customColors.bgNeutral },
          position: 'relative',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: theme.palette.primary.main,
            fontSize: '0.8rem',
            fontWeight: 700,
            fontFamily: '"Manrope", sans-serif',
            flexShrink: 0,
            transition: 'all 0.25s',
          }}
        >
          AI
        </Avatar>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            transition: 'opacity 0.2s ease, width 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
            Atlas Industries
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }} noWrap>
            Manufacturing · Pro
          </Typography>
        </Box>

        {!collapsed && (
          <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
        )}

        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setCollapsed((c) => !c); }}
          sx={{
            position: 'absolute',
            right: -14,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 28,
            height: 28,
            bgcolor: theme.palette.customColors.white,
            border: border,
            color: theme.palette.text.secondary,
            zIndex: 10,
            boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              borderColor: theme.palette.primary.main,
            },
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRightIcon sx={{ fontSize: 16 }} />
            : <ChevronLeftIcon sx={{ fontSize: 16 }} />
          }
        </IconButton>
      </Box>

      {/* ── Nav sections ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 2,
          px: collapsed ? 1 : 1.5,
          transition: 'padding 0.25s ease',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: theme.palette.customColors.borderLight, borderRadius: 2 },
        }}
      >
        {NAV_SECTIONS.map((section) => (
          <Box key={section.sectionLabel} sx={{ mb: collapsed ? 1.5 : 2 }}>
            {collapsed ? (
              <Box sx={{ height: 1, bgcolor: theme.palette.customColors.borderLight, mx: 1, mb: 1.25, opacity: 0.6 }} />
            ) : (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  px: 1,
                  mb: 0.75,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: 'text.secondary',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {section.sectionLabel}
              </Typography>
            )}

            {section.items.map((item) => {
              const isActive = activeId === item.id;
              const linkContent = (
                <Link
                  key={item.id}
                  to={item.path}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      gap: collapsed ? 0 : 1.5,
                      px: collapsed ? 0 : 1.25,
                      py: 1,
                      mb: 0.25,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      bgcolor: isActive ? theme.palette.customColors.primaryTransparent : 'transparent',
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: isActive
                          ? theme.palette.customColors.primaryTransparent
                          : theme.palette.customColors.bgNeutral,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                        flexShrink: 0,
                        '& svg': { fontSize: '1.15rem' },
                        transition: 'color 0.15s ease',
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box
                      sx={{
                        overflow: 'hidden',
                        opacity: collapsed ? 0 : 1,
                        maxWidth: collapsed ? 0 : 200,
                        transition: 'opacity 0.2s ease, max-width 0.25s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          color: 'inherit',
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.id} title={item.label} placement="right" arrow>
                    <div>{linkContent}</div>
                  </Tooltip>
                );
              }

              return linkContent;
            })}
          </Box>
        ))}
      </Box>

      {/* ── User footer ──────────────────────────────────────────────────── */}
      <Box
        onClick={handleLogout}
        sx={{
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1.5,
          borderTop: border,
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          '&:hover': { bgcolor: theme.palette.customColors.bgNeutral },
        }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: theme.palette.primary.main,
            fontSize: '0.8rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          PN
        </Avatar>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? 0 : 200,
            transition: 'opacity 0.2s ease, max-width 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }} noWrap>
            Pratik Nichit
          </Typography>
          <Chip
            label="Admin"
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 600,
              bgcolor: theme.palette.customColors.primaryTransparent,
              color: theme.palette.primary.main,
              '& .MuiChip-label': { px: 0.75 },
              borderRadius: 0.75,
              mt: 0.25,
            }}
          />
        </Box>

        {!collapsed && (
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            sx={{ color: theme.palette.text.secondary, '&:hover': { color: theme.palette.error.main } }}
            title="Log Out"
          >
            <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
