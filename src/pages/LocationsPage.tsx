import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAllLocations, addLocationAsync, updateLocationAsync, deleteLocationAsync } from '../redux/locationsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import LocationCard from '../components/LocationCard';
import AddLocationModal from '../components/AddLocationModal';
import EditLocationModal from '../components/EditLocationModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import type { LocationItem } from '../types/location';

export interface LocationsPageProps {
  organizationName?: string;
}

export default function LocationsPage({ organizationName = 'Atlas' }: LocationsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();
  const locations = useAppSelector(selectAllLocations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<LocationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );

  const handleAddLocation = async (newLoc: Omit<LocationItem, 'id'>) => {
    setIsSaving(true);
    try {
      await dispatch(addLocationAsync(newLoc)).unwrap();
      setSnackbar({ open: true, message: 'Location added successfully', severity: 'success' });
      setIsAddModalOpen(false);
    } catch {
      setSnackbar({ open: true, message: 'Failed to add location', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditLocation = (loc: LocationItem) => setEditingLocation(loc);
  const handleDeleteLocation = (loc: LocationItem) => setDeletingLocation(loc);

  const handleSaveEdit = async (updated: LocationItem) => {
    setIsSaving(true);
    try {
      await dispatch(updateLocationAsync(updated)).unwrap();
      setEditingLocation(null);
      setSnackbar({ open: true, message: 'Location updated successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update location', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLocation) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteLocationAsync(deletingLocation.id)).unwrap();
      setDeletingLocation(null);
      setSnackbar({ open: true, message: `"${deletingLocation.name}" deleted`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete location', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Locations' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* ── Header Bar ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: '"Manrope", sans-serif',
              fontSize: '1.75rem',
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Locations
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: '0.9rem',
              color: 'text.secondary',
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            Sites, buildings, warehouses & rooms.
          </Typography>
        </Box>

        <AppButton
          variant="default"
          size="sm"
          startIcon={<AddIcon />}
          onClick={() => setIsAddModalOpen(true)}
          sx={{
            bgcolor: '#4F46E5',
            borderRadius: '10px',
            px: 2.2,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            fontFamily: '"Manrope", sans-serif',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
            '&:hover': {
              bgcolor: '#4338CA',
            },
          }}
        >
          New location
        </AppButton>
      </Box>

      {/* ── Locations Grid ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
          },
          gap: 3,
        }}
      >
        {locations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            onEdit={handleEditLocation}
            onDelete={handleDeleteLocation}
          />
        ))}
      </Box>

      {/* ── Modals & Dialogs ─────────────────────────────────────────────────── */}
      <EditLocationModal
        open={Boolean(editingLocation)}
        location={editingLocation}
        onClose={() => setEditingLocation(null)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingLocation)}
        entityName={deletingLocation?.name}
        onClose={() => setDeletingLocation(null)}
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

      {/* ── Add Location Modal ──────────────────────────────────────────────── */}
      <AddLocationModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLocation}
        isSaving={isSaving}
      />
    </Box>
  );
}
