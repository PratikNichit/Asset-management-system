import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAllDepartments, updateDepartmentAsync, deleteDepartmentAsync } from '../redux/departmentsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import DepartmentCard from '../components/DepartmentCard';
import NewDepartmentPage from './NewDepartmentPage';
import EditDepartmentModal from '../components/EditDepartmentModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import type { Department } from '../types/department';

export interface DepartmentsPageProps {
  organizationName?: string;
}

export default function DepartmentsPage({ organizationName = 'Atlas' }: DepartmentsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();
  const departments = useAppSelector(selectAllDepartments);

  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );

  const handleEditDept = (dept: Department) => setEditingDept(dept);
  const handleDeleteDept = (dept: Department) => setDeletingDept(dept);

  const handleSaveEdit = async (updated: Department) => {
    setIsSaving(true);
    try {
      await dispatch(updateDepartmentAsync(updated)).unwrap();
      setEditingDept(null);
      setSnackbar({ open: true, message: 'Department updated successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update department', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingDept) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteDepartmentAsync(deletingDept.id)).unwrap();
      setDeletingDept(null);
      setSnackbar({ open: true, message: `"${deletingDept.name}" deleted`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete department', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isCreatingDepartment) {
      setBreadcrumbLinks([
        { label: organizationName, path: '/dashboard' },
        { label: 'Departments' },
      ]);
    }
  }, [isCreatingDepartment, organizationName, setBreadcrumbLinks]);

  // ── Render New Department Form View ─────────────────────────────────────────
  if (isCreatingDepartment) {
    return (
      <NewDepartmentPage
        organizationName={organizationName}
        onCancel={() => setIsCreatingDepartment(false)}
        onSuccess={() => setIsCreatingDepartment(false)}
      />
    );
  }

  // ── Render Departments Grid Overview ───────────────────────────────────────
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
            sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem', color: 'text.primary' }}
          >
            Departments
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.9rem', color: 'text.secondary' }}>
            Organize people and assets by team.
          </Typography>
        </Box>

        <AppButton
          variant="default"
          size="sm"
          startIcon={<AddIcon />}
          onClick={() => setIsCreatingDepartment(true)}
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
          New department
        </AppButton>
      </Box>

      {/* ── Departments Grid ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {departments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            onEdit={handleEditDept}
            onDelete={handleDeleteDept}
          />
        ))}
      </Box>

      {/* ── Modals & Dialogs ─────────────────────────────────────────────────── */}
      <EditDepartmentModal
        open={Boolean(editingDept)}
        department={editingDept}
        onClose={() => setEditingDept(null)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingDept)}
        entityName={deletingDept?.name}
        onClose={() => setDeletingDept(null)}
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
