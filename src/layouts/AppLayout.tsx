import type { ReactNode } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppSidebar from '../components/AppSidebar';
import AppTopBar from '../components/AppTopBar';
import { useLayout } from '../hooks/useLayout';

export interface AppLayoutProps {
  children?: ReactNode;
  onNewAssetClick?: () => void;
}

/**
 * AppLayout — Main application layout shell.
 *
 * Combines AppSidebar, AppTopBar, and a main scrollable content area.
 * Renders nested routes via <Outlet /> or explicitly passed children.
 */
export default function AppLayout({ children, onNewAssetClick }: AppLayoutProps) {
  const navigate = useNavigate();
  const { breadcrumbs, breadcrumbLinks } = useLayout();

  const handleNewAsset = () => {
    if (onNewAssetClick) {
      onNewAssetClick();
    } else {
      navigate('/assets/new');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* ── Collapsible Left Sidebar ────────────────────────────────────────── */}
      <AppSidebar />

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header Bar */}
        <AppTopBar
          breadcrumbs={breadcrumbs}
          breadcrumbPaths={breadcrumbLinks.map((c) => c.path)}
          onNewAsset={handleNewAsset}
        />

        {/* Page Content Container */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 4,
          }}
        >
          {children ?? <Outlet />}
        </Box>
      </Box>
    </Box>
  );
}
