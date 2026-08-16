import { useState } from 'react';
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

// ─── Constants ────────────────────────────────────────────────────────────────

const EXPANDED_WIDTH = 300;
const COLLAPSED_WIDTH = 68;
const TRANSITION = 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem { id: string; label: string; icon: React.ReactNode; }
interface NavSection { sectionLabel: string; items: NavItem[]; }

// ─── Nav config ──────────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    sectionLabel: 'WORKSPACE',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
      { id: 'assets', label: 'Assets', icon: <Inventory2OutlinedIcon /> },
      { id: 'assign-asset', label: 'Assign asset', icon: <AssignmentIndOutlinedIcon /> },
      { id: 'maintenance', label: 'Maintenance', icon: <BuildOutlinedIcon /> },
    ],
  },
  {
    sectionLabel: 'PEOPLE AND STRUCTURE',
    items: [
      { id: 'employees', label: 'Employees', icon: <PeopleOutlinedIcon /> },
      { id: 'departments', label: 'Departments', icon: <ApartmentOutlinedIcon /> },
      { id: 'locations', label: 'Locations', icon: <LocationOnOutlinedIcon /> },
      { id: 'categories', label: 'Categories', icon: <CategoryOutlinedIcon /> },
    ],
  },
  {
    sectionLabel: 'INSIGHTS',
    items: [
      { id: 'reports', label: 'Reports', icon: <BarChartOutlinedIcon /> },
      { id: 'notifications', label: 'Notifications', icon: <NotificationsOutlinedIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsOutlinedIcon /> },
    ],
  },
];

// ─── Props ───────────────────────────────────────────────────────────────────

export interface AppSidebarProps {
  /** Currently active nav item id. @default 'dashboard' */
  activeItem?: string;
  /** Callback when a nav item is clicked. */
  onNavChange?: (id: string) => void;
  /** Start the sidebar in collapsed state. @default false */
  defaultCollapsed?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * AppSidebar — collapsible left navigation panel.
 *
 * Expands to show labels + section headings (256px).
 * Collapses to an icon-rail (68px) with tooltips on hover.
 * The toggle button lives at the bottom-right corner of the header area.
 */
export default function AppSidebar({
  activeItem = 'dashboard',
  onNavChange,
  defaultCollapsed = false,
}: AppSidebarProps) {
  const theme = useTheme();
  const [active, setActive] = useState(activeItem);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  function handleClick(id: string) {
    setActive(id);
    onNavChange?.(id);
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
        overflow: 'visible',   // allow toggle button to overflow right edge
        flexShrink: 0,
        position: 'relative',  // establish stacking context
        zIndex: 10,            // sit above AppTopBar so toggle isn't hidden
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
        <Tooltip title={collapsed ? 'Atlas Industries' : ''} placement="right">
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
        </Tooltip>

        {/* Company name — fades out when collapsed */}
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

        {/* ── Collapse / Expand toggle ── */}
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
            {/* Section label — hidden when collapsed, replaced by a divider line */}
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
              const isActive = active === item.id;
              return (
                <Tooltip
                  key={item.id}
                  title={collapsed ? item.label : ''}
                  placement="right"
                  arrow
                >
                  <Box
                    onClick={() => handleClick(item.id)}
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
                    {/* Icon — always visible */}
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

                    {/* Label — fades out when collapsed */}
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
                          lineHeight: 1,
                          color: 'inherit',
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* ── User footer ──────────────────────────────────────────────────── */}
      <Tooltip title={collapsed ? 'Priya Sharma' : ''} placement="right">
        <Box
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
            PS
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
              Priya Sharma
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
        </Box>
      </Tooltip>
    </Box>
  );
}
