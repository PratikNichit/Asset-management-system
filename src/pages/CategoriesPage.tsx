import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAllCategories, updateCategoryAsync, deleteCategoryAsync } from '../redux/categoriesSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import CategoryCard from '../components/CategoryCard';
import NewCategoryPage from './NewCategoryPage';
import EditCategoryModal from '../components/EditCategoryModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import type { AssetCategoryItem } from '../types/category';

export interface CategoriesPageProps {
  organizationName?: string;
}

export default function CategoriesPage({ organizationName = 'Atlas' }: CategoriesPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectAllCategories);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AssetCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AssetCategoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );

  const handleEditCategory = (cat: AssetCategoryItem) => setEditingCategory(cat);
  const handleDeleteCategory = (cat: AssetCategoryItem) => setDeletingCategory(cat);

  const handleSaveEdit = async (updated: AssetCategoryItem) => {
    setIsSaving(true);
    try {
      await dispatch(updateCategoryAsync(updated)).unwrap();
      setEditingCategory(null);
      setSnackbar({ open: true, message: 'Category updated successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update category', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCategoryAsync(deletingCategory.id)).unwrap();
      setDeletingCategory(null);
      setSnackbar({ open: true, message: `"${deletingCategory.name}" deleted`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete category', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isCreatingCategory) {
      setBreadcrumbLinks([
        { label: organizationName, path: '/dashboard' },
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      {/* ── Header Bar ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          pb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                fontFamily: '"Manrope", sans-serif',
                fontSize: '1.75rem',
                letterSpacing: '-0.02em',
                color: 'text.primary',
              }}
            >
              Categories
            </Typography>
            <Chip
              label={categories.length}
              size="small"
              aria-label={`${categories.length} categories`}
              sx={{ 
                fontWeight: 700, 
                height: 24, 
                borderRadius: 1.5,
                bgcolor: 'action.selected',
                color: 'text.primary'
              }}
            />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75, fontSize: '0.9rem', maxWidth: 520, lineHeight: 1.6 }}
          >
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

      {/* ── Categories Grid (3 columns on desktop) ──────────────────────────── */}
      {categories.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 2, md: 3 },
            alignItems: 'stretch',
            '& > *': { minWidth: 0, height: '100%' },
          }}
        >
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </Box>
      ) : (
        // ── Empty State ──────────────────────────────────────────────────────
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1.5,
            py: 8,
            px: 3,
            border: '1.5px dashed',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <CategoryOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            No categories yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            Create your first category to start grouping assets by type.
          </Typography>
          <AppButton
            variant="default"
            size="sm"
            startIcon={<AddIcon />}
            onClick={() => setIsCreatingCategory(true)}
          >
            New category
          </AppButton>
        </Box>
      )}

      {/* ── Modals & Dialogs ─────────────────────────────────────────────────── */}
      <EditCategoryModal
        open={Boolean(editingCategory)}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingCategory)}
        entityName={deletingCategory?.name}
        onClose={() => setDeletingCategory(null)}
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