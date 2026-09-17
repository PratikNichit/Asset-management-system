import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';

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
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </Box>

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
