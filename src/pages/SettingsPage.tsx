import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useLayout } from '../hooks/useLayout';
import WorkspaceSettingsTab from '../components/settings/WorkspaceSettingsTab';
import MembersSettingsTab from '../components/settings/MembersSettingsTab';
import BillingSettingsTab from '../components/settings/BillingSettingsTab';
import AppearanceSettingsTab from '../components/settings/AppearanceSettingsTab';
import NotificationSettingsTab from '../components/settings/NotificationSettingsTab';
import SecuritySettingsTab from '../components/settings/SecuritySettingsTab';
import UserManagementTab from '../components/settings/UserManagementTab';

export interface SettingsPageProps {
  organizationName?: string;
}

export type SettingsTab =
  | 'workspace'
  | 'members'
  | 'users'
  | 'billing'
  | 'appearance'
  | 'notifications'
  | 'security';

const SETTINGS_TABS: { id: SettingsTab; label: string; icon?: string }[] = [
  { id: 'workspace',     label: 'Workspace' },
  { id: 'members',       label: 'Members' },
  { id: 'users',         label: 'User management' },
  { id: 'billing',       label: 'Billing' },
  { id: 'appearance',    label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security',      label: 'Security' },
];

export default function SettingsPage({ organizationName = 'Atlas' }: SettingsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const [activeTab, setActiveTab] = useState<SettingsTab>('workspace');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const notify = (msg: string, severity: typeof toastSeverity = 'success') => {
    setToastSeverity(severity);
    setToastMessage(msg);
  };

  useEffect(() => {
    const tabLabel = SETTINGS_TABS.find((t) => t.id === activeTab)?.label || 'Workspace';
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Settings', path: '/settings' },
      { label: tabLabel },
    ]);
  }, [activeTab, organizationName, setBreadcrumbLinks]);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'workspace':
        return <WorkspaceSettingsTab onSave={() => notify('Workspace details saved successfully.')} />;
      case 'members':
        return <MembersSettingsTab />;
      case 'users':
        return <UserManagementTab onNotify={(msg) => notify(msg, 'success')} />;
      case 'billing':
        return <BillingSettingsTab onManageSubscription={() => notify('Redirecting to subscription management portal...', 'info')} />;
      case 'appearance':
        return <AppearanceSettingsTab onToggleTheme={() => notify('Theme preference updated.', 'info')} />;
      case 'notifications':
        return <NotificationSettingsTab />;
      case 'security':
        return <SecuritySettingsTab onNotify={(msg) => notify(msg, 'info')} />;
      default:
        return <WorkspaceSettingsTab onSave={() => notify('Workspace details saved successfully.')} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem' }}
        >
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
          Manage your workspace, users, and personal preferences.
        </Typography>
      </Box>

      {/* ── Sidebar + Content ─────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 3.5, alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Left nav */}
        <Box sx={{ width: { xs: '100%', md: 210 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {SETTINGS_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  px: 2,
                  py: 1.2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'primary.main' : 'text.primary',
                  bgcolor: isActive ? 'customColors.primaryTransparent' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isActive ? 'customColors.primaryTransparent' : 'customColors.bgLight',
                  },
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          {renderActiveTabContent()}
        </Box>
      </Box>

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4500}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
