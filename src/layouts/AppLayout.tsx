import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import AppSidebar from '../components/AppSidebar';
import AppTopBar from '../components/AppTopBar';
import { useLayout } from '../hooks/useLayout';

export interface AppLayoutProps {
  children: ReactNode;
  onNewAssetClick?: () => void;
}

/**
 * AppLayout — Main application layout shell.
 *
 * Combines AppSidebar, AppTopBar, and a main scrollable content area,
 * consuming LayoutContext for navigation and breadcrumbs state.
 */
export default function AppLayout({ children, onNewAssetClick }: AppLayoutProps) {
  const { activeItem, setActiveItem, breadcrumbs } = useLayout();

  const handleNewAsset = () => {
    if (onNewAssetClick) {
      onNewAssetClick();
    } else {
      alert('New asset action triggered');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* ── Collapsible Left Sidebar ────────────────────────────────────────── */}
      <AppSidebar
        activeItem={activeItem}
        onNavChange={(id) => setActiveItem(id)}
      />

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header Bar */}
        <AppTopBar
          breadcrumbs={breadcrumbs}
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
          {children}
        </Box>
      </Box>
    </Box>
  );
}
