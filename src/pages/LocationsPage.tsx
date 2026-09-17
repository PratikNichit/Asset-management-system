import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAllLocations, addLocation } from '../redux/locationsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import LocationCard from '../components/LocationCard';
import AddLocationModal from '../components/AddLocationModal';
import type { LocationItem } from '../types/location';

export interface LocationsPageProps {
  organizationName?: string;
}

export default function LocationsPage({ organizationName = 'Atlas' }: LocationsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();
  const locations = useAppSelector(selectAllLocations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Locations' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const handleAddLocation = (newLoc: Omit<LocationItem, 'id'>) => {
    dispatch(addLocation(newLoc));
  };

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
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </Box>

      {/* ── Add Location Modal ──────────────────────────────────────────────── */}
      <AddLocationModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLocation}
      />
    </Box>
  );
}
