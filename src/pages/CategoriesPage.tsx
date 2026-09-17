import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

import { useAppSelector } from '../app/hooks';
import { selectAllCategories } from '../redux/categoriesSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import CategoryCard from '../components/CategoryCard';
import NewCategoryPage from './NewCategoryPage';

export interface CategoriesPageProps {
  organizationName?: string;
}

export default function CategoriesPage({ organizationName = 'Atlas' }: CategoriesPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const categories = useAppSelector(selectAllCategories);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    if (!isCreatingCategory) {
      setBreadcrumbLinks([
        { label: organizationName, navId: 'dashboard' },
        { label: 'Categories' },
      ]);
    }
  }, [isCreatingCategory, organizationName, setBreadcrumbLinks]);

  // ── Render New Category Form View ──────────────────────────────────────────
  if (isCreatingCategory) {
    return (
      <NewCategoryPage
        organizationName={organizationName}
        onCancel={() => setIsCreatingCategory(false)}
        onSuccess={() => setIsCreatingCategory(false)}
      />
    );
  }

  // ── Render Categories Grid Overview ───────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* ── Header Bar ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem' }}
          >
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
            Group assets by type. Categories power filtering and reporting.
          </Typography>
        </Box>

        <AppButton
          variant="default"
          size="sm"
          startIcon={<AddIcon />}
          onClick={() => setIsCreatingCategory(true)}
        >
          New category
        </AppButton>
      </Box>

      {/* ── Categories Grid ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </Box>
    </Box>
  );
}
