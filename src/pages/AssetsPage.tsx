import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useLayout } from '../hooks/useLayout';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import AppButton from '../components/AppButton';
import PageHeader from '../components/PageHeader';
import AssetTable from '../components/AssetTable';
import AssetDetailView from '../components/AssetDetailView';
import EditAssetModal from '../components/EditAssetModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import { DEFAULT_ASSET_COLUMNS } from '../types/assetColumns';
import { selectAllAssets, updateAssetAsync, deleteAssetAsync } from '../redux/assetsSlice';
import type { Asset } from '../types/asset';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AssetsPageProps {
  organizationName?: string;
  /** @deprecated — navigate to /assets/new directly instead */
  isCreatingAssetDirectly?: boolean;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetsPage({ organizationName = 'Atlas' }: AssetsPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { setBreadcrumbLinks, selectedAssetId, setSelectedAssetId } = useLayout();

  const assetList = useAppSelector(selectAllAssets);

  // ── Modals state ──────────────────────────────────────────────────────────
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

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

  useEffect(() => {
    const notification = location.state?.assetNotification as
      | { message: string; severity: 'success' | 'error' }
      | undefined;
    if (!notification) return;
    setSnackbar({ open: true, ...notification });
    navigate('/assets', { replace: true, state: null });
  }, [location.state, navigate]);

  const inUseCount = useMemo(
    () => assetList.filter((a) => a.status === 'In Use').length,
    [assetList],
  );

  function handleNewAsset() {
    navigate('/assets/new');
  }

  function handleExport() {
    // Build CSV
    const headers = ['Code', 'Name', 'Category', 'Serial', 'Department', 'Location', 'Assigned To', 'Status', 'Warranty Expiry'];
    const rows = assetList.map((a) => [
      a.code, a.name, a.category, a.serial, a.department, a.location,
      a.assignedTo ?? '', a.status, a.warrantyExpiry ?? '',
    ]);
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assets-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const handleEditAsset = (asset: Asset) => setEditingAsset(asset);

  const handleSaveAsset = async (updatedAsset: Asset) => {
    setIsSaving(true);
    try {
      await dispatch(updateAssetAsync(updatedAsset)).unwrap();
      setEditingAsset(null);
      setSnackbar({ open: true, message: 'Asset updated successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update asset', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete handlers ───────────────────────────────────────────────────────
  const handleDeleteClick = (asset: Asset) => setDeletingAsset(asset);

  const handleConfirmDelete = async () => {
    if (!deletingAsset) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteAssetAsync(deletingAsset.id)).unwrap();
      setDeletingAsset(null);
      setSelectedAssetId(null);
      setSnackbar({ open: true, message: `"${deletingAsset.name}" deleted`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete asset', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render Asset Detail View ───────────────────────────────────────────────
  if (selectedAsset) {
    return (
      <Box>
        <AssetDetailView
          asset={selectedAsset}
          onBack={() => setSelectedAssetId(null)}
          onEdit={handleEditAsset}
          onDelete={handleDeleteClick}
        />

        <EditAssetModal
          open={Boolean(editingAsset)}
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSave={handleSaveAsset}
          isSaving={isSaving}
        />

        <ConfirmDeleteDialog
          open={Boolean(deletingAsset)}
          entityName={deletingAsset?.name}
          onClose={() => setDeletingAsset(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
