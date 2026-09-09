import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useLayout } from '../hooks/useLayout';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import AppButton from '../components/AppButton';
import PageHeader from '../components/PageHeader';
import AssetTable from '../components/AssetTable';
import AssetDetailView from '../components/AssetDetailView';
import NewAssetPage from './NewAssetPage';
import { DEFAULT_ASSET_COLUMNS } from '../types/assetColumns';
import type { Asset } from '../types/asset';
import { selectAllAssets, addAsset } from '../redux/assetsSlice';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AssetsPageProps {
  organizationName?: string;
  isCreatingAssetDirectly?: boolean;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetsPage({ organizationName = 'Atlas', isCreatingAssetDirectly = false }: AssetsPageProps) {
  const { setBreadcrumbs, selectedAssetId, setSelectedAssetId } = useLayout();
  const dispatch = useAppDispatch();

  const assetList = useAppSelector(selectAllAssets);
  const [isCreatingAsset, setIsCreatingAsset] = useState(isCreatingAssetDirectly);

  useEffect(() => {
    setIsCreatingAsset(isCreatingAssetDirectly);
  }, [isCreatingAssetDirectly]);

  const selectedAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    return assetList.find((a) => a.id === selectedAssetId || a.code === selectedAssetId) ?? null;
  }, [selectedAssetId, assetList]);

  useEffect(() => {
    if (!isCreatingAsset) {
      if (selectedAsset) {
        setBreadcrumbs([organizationName, 'Assets', selectedAsset.name]);
      } else {
        setBreadcrumbs([organizationName, 'Assets']);
      }
    }
  }, [selectedAsset, isCreatingAsset, organizationName, setBreadcrumbs]);

  const inUseCount = useMemo(
    () => assetList.filter((a) => a.status === 'In Use').length,
    [assetList],
  );

  function handleNewAsset() {
    setIsCreatingAsset(true);
  }

  function handleExport() {
    console.log('Export clicked');
  }

  const handleAssetCreated = (newAsset: Asset) => {
    dispatch(addAsset(newAsset));
    setIsCreatingAsset(false);
  };

  // ── Render New Asset Form View ─────────────────────────────────────────────
  if (isCreatingAsset) {
    return (
      <NewAssetPage
        organizationName={organizationName}
        onCancel={() => setIsCreatingAsset(false)}
        onSuccess={handleAssetCreated}
      />
    );
  }

  // ── Render Asset Detail View ───────────────────────────────────────────────
  if (selectedAsset) {
    return (
      <AssetDetailView
        asset={selectedAsset}
        onBack={() => setSelectedAssetId(null)}
      />
    );
  }

  // ── Render Assets Table View ───────────────────────────────────────────────
  return (
    <Box>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <PageHeader
        title="Assets"
        subtitle={`${assetList.length} total · ${inUseCount} in use`}
        actions={
          <>
            <AppButton
              id="asset-export-btn"
              variant="outline"
              size="sm"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleExport}
            >
              Export
            </AppButton>
            <AppButton
              id="asset-new-btn"
              variant="default"
              size="sm"
              startIcon={<AddIcon />}
              onClick={handleNewAsset}
              sx={{
                bgcolor: '#4F46E5',
                borderRadius: '10px',
                px: 2.2,
                py: 1,
                fontWeight: 600,
                fontFamily: '"Manrope", sans-serif',
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                '&:hover': {
                  bgcolor: '#4338CA',
                },
              }}
            >
              New asset
            </AppButton>
          </>
        }
      />

      {/* ── Table — clicking any row opens AssetDetailView ────────────────── */}
      <AssetTable
        assets={assetList}
        columns={DEFAULT_ASSET_COLUMNS}
        searchFields={['name', 'code', 'serial']}
        searchPlaceholder="Search by name, code, serial…"
        onRowClick={(asset) => setSelectedAssetId(asset.id)}
      />
    </Box>
  );
}
