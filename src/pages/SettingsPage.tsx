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

export interface SettingsPageProps {
  organizationName?: string;
}

export type SettingsTab = 'workspace' | 'members' | 'billing' | 'appearance' | 'notifications' | 'security';

const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'members', label: 'Members' },
  { id: 'billing', label: 'Billing' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
];

export default function SettingsPage({ organizationName = 'Atlas' }: SettingsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const [activeTab, setActiveTab] = useState<SettingsTab>('workspace');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const tabLabel = SETTINGS_TABS.find((t) => t.id === activeTab)?.label || 'Workspace';
    setBreadcrumbLinks([
      { label: organizationName, navId: 'dashboard' },
      { label: 'Settings', navId: 'settings' },
      { label: tabLabel },
    ]);
  }, [activeTab, organizationName, setBreadcrumbLinks]);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'workspace':
        return <WorkspaceSettingsTab onSave={() => setToastMessage('Workspace details saved successfully.')} />;
      case 'members':
        return <MembersSettingsTab />;
      case 'billing':
        return <BillingSettingsTab onManageSubscription={() => setToastMessage('Redirecting to subscription management portal...')} />;
      case 'appearance':
        return <AppearanceSettingsTab onToggleTheme={() => setToastMessage('Theme preference updated.')} />;
      case 'notifications':
        return <NotificationSettingsTab />;
      case 'security':
        return <SecuritySettingsTab onNotify={(msg) => setToastMessage(msg)} />;
      default:
        return <WorkspaceSettingsTab onSave={() => setToastMessage('Workspace details saved successfully.')} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* ── Page Header Bar ─────────────────────────────────────────────────── */}
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem' }}
        >
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
          Manage your workspace and personal preferences.
        </Typography>
      </Box>

      {/* ── Settings Sidebar + Content Panel Grid ───────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          gap: 3.5,
          alignItems: 'flex-start',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        {/* ── Left Sidebar Sub-Navigation Tabs ─────────────────────────────── */}
        <Box
          sx={{
            width: { xs: '100%', md: 200 },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
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

        {/* ── Right Content Panel ─────────────────────────────────────────── */}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          {renderActiveTabContent()}
        </Box>
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastMessage(null)} severity="info" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
