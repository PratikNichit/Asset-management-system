import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import type { AppNotification, NotificationType } from '../types/notification';

export interface NotificationsPageProps {
  organizationName?: string;
}

export const NOTIFICATION_COLOR_MAP: Record<NotificationType, { badgeBg: string; iconColor: string }> = {
  warranty: { badgeBg: 'customColors.errorTransparent', iconColor: 'error.main' },
  maintenance: { badgeBg: 'customColors.warningTransparent', iconColor: 'warning.main' },
  assignment: { badgeBg: 'customColors.successTransparent', iconColor: 'success.main' },
  department: { badgeBg: 'customColors.infoTransparent', iconColor: 'info.main' },
  system: { badgeBg: 'customColors.primaryTransparent', iconColor: 'primary.main' },
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOT-001',
    title: 'Warranty expiring in 14 days',
    description: 'Toyota 8FGCU25 Forklift (AST-00701) warranty ends Apr 22.',
    timeAgo: '2h ago',
    isUnread: true,
    type: 'warranty',
    badgeBg: 'customColors.errorTransparent',
    iconColor: 'error.main',
  },
  {
    id: 'NOT-002',
    title: 'Maintenance overdue',
    description: 'Zebra ZT411 Printer (AST-01244) is 8 days overdue.',
    timeAgo: '5h ago',
    isUnread: true,
    type: 'maintenance',
    badgeBg: 'customColors.warningTransparent',
    iconColor: 'warning.main',
  },
  {
    id: 'NOT-003',
    title: 'Asset assigned',
    description: 'MacBook Pro 16" assigned to Léa Dubois.',
    timeAgo: 'Yesterday',
    isUnread: false,
    type: 'assignment',
    badgeBg: 'customColors.successTransparent',
    iconColor: 'success.main',
  },
  {
    id: 'NOT-004',
    title: 'New department created',
    description: "You created the 'Biomed' department.",
    timeAgo: '2 days ago',
    isUnread: false,
    type: 'department',
    badgeBg: 'customColors.infoTransparent',
    iconColor: 'info.main',
  },
  {
    id: 'NOT-005',
    title: '3 warranties expiring this month',
    description: 'Review the warranty report to plan renewals.',
    timeAgo: '3 days ago',
    isUnread: false,
    type: 'warranty',
    badgeBg: 'customColors.errorTransparent',
    iconColor: 'error.main',
  },
];

function renderNotificationIcon(type: NotificationType) {
  const color = NOTIFICATION_COLOR_MAP[type].iconColor;
  const sx = { fontSize: 20, color };
  switch (type) {
    case 'warranty':
      return <ShieldOutlinedIcon sx={sx} />;
    case 'maintenance':
      return <BuildOutlinedIcon sx={sx} />;
    case 'assignment':
      return <PersonAddAlt1OutlinedIcon sx={sx} />;
    case 'department':
      return <ApartmentOutlinedIcon sx={sx} />;
    default:
      return <NotificationsOutlinedIcon sx={sx} />;
  }
}

export default function NotificationsPage({ organizationName = 'Atlas' }: NotificationsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, navId: 'dashboard' },
      { label: 'Notifications' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread).length;
  }, [notifications]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: !n.isUnread } : n))
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* ── Page Header Bar ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem' }}
          >
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
            {unreadCount} unread
          </Typography>
        </Box>

        <AppButton
          variant="outline"
          size="sm"
          startIcon={<CheckIcon />}
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
        >
          Mark all read
        </AppButton>
      </Box>

      {/* ── Centered Notifications List Paper Container ─────────────────────── */}
      <Box sx={{ maxWidth: 780, mx: 'auto', width: '100%' }}>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            borderColor: 'customColors.borderLight',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          {notifications.map((item) => (
            <Box
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                borderBottom: '1px solid',
                borderColor: 'customColors.borderLight',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                bgcolor: item.isUnread ? 'rgba(81, 89, 215, 0.02)' : 'transparent',
                '&:last-child': {
                  borderBottom: 'none',
                },
                '&:hover': {
                  bgcolor: 'customColors.bgLight',
                },
              }}
            >
              {/* Left Circle Icon Badge */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  bgcolor: NOTIFICATION_COLOR_MAP[item.type].badgeBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.25,
                }}
              >
                {renderNotificationIcon(item.type)}
              </Box>

              {/* Middle Title, Description & Timestamp */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: 'text.primary',
                      fontFamily: '"Manrope", sans-serif',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Unread Blue Dot */}
                  {item.isUnread && (
                    <Box
                      component="span"
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: '#3B82F6',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>

                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    color: 'text.secondary',
                    mt: 0.4,
                    lineHeight: 1.4,
                  }}
                >
                  {item.description}
                </Typography>

                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    color: 'text.secondary',
                    mt: 0.75,
                    opacity: 0.75,
                  }}
                >
                  {item.timeAgo}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}
