import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';

export interface AssetsPageProps {
  organizationName?: string;
}

export default function AssetsPage({ organizationName = 'Atlas Industries' }: AssetsPageProps) {
  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Assets']);
  }, [organizationName, setBreadcrumbs]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Assets Catalog
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage all hardware, software, and physical assets across the enterprise.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 2.5,
          borderColor: 'customColors.borderLight',
          bgcolor: 'customColors.white',
        }}
      >
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'primary.light', color: 'primary.main', mb: 2, opacity: 0.8 }}>
          <Inventory2OutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Assets Inventory Module
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          This page will feature asset tables, filtering by category/status, CSV export, and detailed asset lifecycle tracking.
        </Typography>
        <AppButton variant="default">
          Add New Asset
        </AppButton>
      </Paper>
    </Box>
  );
}
