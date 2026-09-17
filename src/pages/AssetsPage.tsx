import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useLayout } from '../hooks/useLayout';
import { useAppSelector } from '../app/hooks';
import AppButton from '../components/AppButton';
import PageHeader from '../components/PageHeader';
import AssetTable from '../components/AssetTable';
import AssetDetailView from '../components/AssetDetailView';
import { DEFAULT_ASSET_COLUMNS } from '../types/assetColumns';
import { selectAllAssets } from '../redux/assetsSlice';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AssetsPageProps {
  organizationName?: string;
  /** @deprecated — navigate to /assets/new directly instead */
  isCreatingAssetDirectly?: boolean;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetsPage({ organizationName = 'Atlas' }: AssetsPageProps) {
  const navigate = useNavigate();
  const { setBreadcrumbLinks, selectedAssetId, setSelectedAssetId } = useLayout();

  const assetList = useAppSelector(selectAllAssets);

  const selectedAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    return assetList.find((a) => a.id === selectedAssetId || a.code === selectedAssetId) ?? null;
  }, [selectedAssetId, assetList]);

  useEffect(() => {
    if (selectedAsset) {
      setBreadcrumbLinks([
        { label: organizationName, path: '/dashboard' },
        { label: 'Assets', path: '/assets' },
        { label: selectedAsset.name },
      ]);
    } else {
      setBreadcrumbLinks([
        { label: organizationName, path: '/dashboard' },
        { label: 'Assets' },
      ]);
    }
  }, [selectedAsset, organizationName, setBreadcrumbLinks]);

  const inUseCount = useMemo(
    () => assetList.filter((a) => a.status === 'In Use').length,
    [assetList],
  );

  function handleNewAsset() {
    navigate('/assets/new');
  }

  function handleExport() {
    console.log('Export clicked');
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
