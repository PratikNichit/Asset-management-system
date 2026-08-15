import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';

export interface CategoriesPageProps {
  organizationName?: string;
}

export default function CategoriesPage({ organizationName = 'Atlas Industries' }: CategoriesPageProps) {
  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Categories']);
  }, [organizationName, setBreadcrumbs]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Asset Categories & Types
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Classifications, hardware taxonomies, software license types, and custom attributes.
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
          <CategoryOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Category Taxonomy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          Configure categories (Laptops, Servers, Vehicles, SaaS Licenses), deprecation models, and asset tagging schema.
        </Typography>
        <AppButton variant="default">
          Add Category
        </AppButton>
      </Paper>
    </Box>
  );
}
