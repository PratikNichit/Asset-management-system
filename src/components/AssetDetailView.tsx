import { useState } from 'react';
import Box from '@mui/material/Box';

import AssetDetailHeader from './asset-detail/AssetDetailHeader';
import AssetSummaryCard from './asset-detail/AssetSummaryCard';
import AssetOverviewTab from './asset-detail/AssetOverviewTab';
import AssetDocumentsTab from './asset-detail/AssetDocumentsTab';
import AssetMaintenanceTab from './asset-detail/AssetMaintenanceTab';
import AssetTimelineTab from './asset-detail/AssetTimelineTab';
import AssetQrCard from './asset-detail/AssetQrCard';
import AssetQuickActionsCard from './asset-detail/AssetQuickActionsCard';
import type { Asset } from '../types/asset';

export interface AssetDetailViewProps {
  asset: Asset;
  onBack: () => void;
  onEdit?: (asset: Asset) => void;
  onReassign?: (asset: Asset) => void;
}

export type AssetDetailTab = 'overview' | 'documents' | 'maintenance' | 'timeline';

export default function AssetDetailView({
  asset,
  onBack,
  onEdit,
  onReassign,
}: AssetDetailViewProps) {
  const [activeTab, setActiveTab] = useState<AssetDetailTab>('overview');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AssetOverviewTab asset={asset} />;
      case 'documents':
        return <AssetDocumentsTab />;
      case 'maintenance':
        return <AssetMaintenanceTab />;
      case 'timeline':
        return <AssetTimelineTab asset={asset} />;
      default:
        return <AssetOverviewTab asset={asset} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ── Top Header Navigation Bar ───────────────────────────────────────── */}
      <AssetDetailHeader asset={asset} onBack={onBack} onEdit={onEdit} />

      {/* ── Main Content Grid (2 Columns) ─────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px', xl: '1fr 380px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ── Left Column: Asset Summary & Tabs ────────────────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Top Summary Card */}
          <AssetSummaryCard asset={asset} />

          {/* Tabbed Navigation Bar */}
          <Box
            sx={{
              display: 'inline-flex',
              bgcolor: 'customColors.bgNeutral',
              p: 0.5,
              borderRadius: 3,
              gap: 0.5,
              width: 'fit-content',
            }}
          >
            {(['overview', 'documents', 'maintenance', 'timeline'] as AssetDetailTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Box
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  sx={{
                    px: 2.25,
                    py: 0.8,
                    borderRadius: 2.25,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'text.primary' : 'text.secondary',
                    bgcolor: isActive ? 'background.paper' : 'transparent',
                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </Box>
              );
            })}
          </Box>

          {/* Tab Content Panel */}
          {renderActiveTabContent()}
        </Box>

        {/* ── Right Column: QR Code & Quick Actions ─────────────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AssetQrCard assetCode={asset.code} />
          <AssetQuickActionsCard asset={asset} onReassign={onReassign} />
        </Box>
      </Box>
    </Box>
  );
}
