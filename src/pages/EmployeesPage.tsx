import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectAllEmployeesList,
  selectSelectedEmployeeId,
  setSelectedEmployeeId,
  addEmployee,
  updateEmployee,
  deleteEmployeeAsync,
} from '../redux/employeesSlice';
import { selectAllAssets } from '../redux/assignAssetSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import EmployeeCard from '../components/EmployeeCard';
import EmployeeDetailView from '../components/EmployeeDetailView';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import ImportCSVModal from '../components/ImportCSVModal';
import AssignAssetModal from '../components/AssignAssetModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import AddEmployeePage from './AddEmployeePage';
import type { Employee } from '../types/employee';
import type { Asset } from '../types/asset';

export interface EmployeesPageProps {
  organizationName?: string;
}

export default function EmployeesPage({ organizationName = 'Atlas' }: EmployeesPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();

  // Redux state
  const employees = useAppSelector(selectAllEmployeesList);
  const selectedEmployeeId = useAppSelector(selectSelectedEmployeeId);
  const assets = useAppSelector(selectAllAssets);

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [localAssets, setLocalAssets] = useState<Asset[]>(assets);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );

  // Synchronize localAssets when Redux assets change
  useEffect(() => {
    setLocalAssets(assets);
  }, [assets]);

  // Selected Employee object
  const selectedEmployee = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return employees.find((e) => e.id === selectedEmployeeId) ?? null;
  }, [selectedEmployeeId, employees]);

  // Unique departments count
  const uniqueDepartmentsCount = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return depts.size;
  }, [employees]);

  // Filtered employees based on search query
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  // Calculate asset counts for each employee
  const assetCountsMap = useMemo(() => {
    const map: Record<string, number> = {};
    localAssets.forEach((asset) => {
      if (asset.assignedTo) {
        map[asset.assignedTo] = (map[asset.assignedTo] || 0) + 1;
      }
    });
    return map;
  }, [localAssets]);

  useEffect(() => {
    if (selectedEmployee) {
      setBreadcrumbLinks([
        { label: organizationName, path: '/dashboard' },
        { label: 'Employees', path: '/employees' },
        { label: selectedEmployee.name },
      ]);
    } else {
      setBreadcrumbLinks([
        { label: organizationName, path: '/dashboard' },
        { label: 'Employees' },
      ]);
    }
  }, [selectedEmployee, organizationName, setBreadcrumbLinks]);

  // Handlers
  const handleSelectEmployee = (employee: Employee) => {
    dispatch(setSelectedEmployeeId(employee.id));
  };

  const handleBackToList = () => {
    dispatch(setSelectedEmployeeId(null));
  };

  const handleAddEmployee = (newEmp: Omit<Employee, 'id'>) => {
    dispatch(addEmployee(newEmp));
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleSaveEditEmployee = (updatedEmp: Employee) => {
    dispatch(updateEmployee(updatedEmp));
    setEditingEmployee(null);
  };

  const handleOpenAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignAsset = (assetId: string, employeeName: string) => {
    setLocalAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, assignedTo: employeeName, status: 'In Use' as const } : a
      )
    );
  };

  const handleDeleteEmployee = (emp: Employee) => setDeletingEmployee(emp);

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteEmployeeAsync(deletingEmployee.id)).unwrap();
      setDeletingEmployee(null);
      setSnackbar({ open: true, message: `"${deletingEmployee.name}" deleted`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete employee', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Available (unassigned) assets for modal
  const availableAssets = useMemo(() => {
    return localAssets.filter((a) => !a.assignedTo || a.status === 'Available');
  }, [localAssets]);

  // ── Render Add Employee Full Page View ─────────────────────────────────────
  if (isAddingEmployee) {
    return (
      <AddEmployeePage
        organizationName={organizationName}
        onCancel={() => setIsAddingEmployee(false)}
        onSuccess={() => setIsAddingEmployee(false)}
      />
    );
  }

  // ── Render Employee Detail View ─────────────────────────────────────────────
  if (selectedEmployee) {
    const assignedAssets = localAssets.filter((a) => a.assignedTo === selectedEmployee.name);

    return (
      <Box>
        <EmployeeDetailView
          employee={selectedEmployee}
          assignedAssets={assignedAssets}
          onBack={handleBackToList}
          onEditProfile={handleOpenEditModal}
          onAssignAsset={handleOpenAssignModal}
          onDelete={handleDeleteEmployee}
        />

        {/* Modals */}
        <EditEmployeeModal
          open={isEditModalOpen}
          employee={editingEmployee || selectedEmployee}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEditEmployee}
        />

        <AssignAssetModal
          open={isAssignModalOpen}
          employee={selectedEmployee}
          availableAssets={availableAssets}
          onClose={() => setIsAssignModalOpen(false)}
          onConfirmAssign={handleConfirmAssignAsset}
        />

        <ConfirmDeleteDialog
          open={Boolean(deletingEmployee)}
          entityName={deletingEmployee?.name}
          onClose={() => setDeletingEmployee(null)}
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

  // ── Render Employees Listing Grid View ──────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page Header Bar */}
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
            Employees
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
            {employees.length} people across {uniqueDepartmentsCount} departments
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AppButton
            variant="outline"
            size="sm"
            startIcon={<UploadFileOutlinedIcon />}
            onClick={() => setIsImportModalOpen(true)}
            sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
          >
            Import CSV
          </AppButton>

          <AppButton
            variant="default"
            size="sm"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingEmployee(true)}
          >
            Add employee
          </AppButton>
        </Box>
      </Box>

      {/* Search Input Bar */}
      <Box sx={{ maxWidth: 380 }}>
        <OutlinedInput
          id="search-employees-input"
          fullWidth
          size="small"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            </InputAdornment>
          }
          sx={{
            borderRadius: 2,
            bgcolor: 'background.paper',
            fontSize: '0.88rem',
            '& fieldset': { borderColor: 'customColors.borderLight' },
            '&:hover fieldset': { borderColor: 'primary.main' },
          }}
        />
      </Box>

      {/* Employee Cards Grid */}
      {filteredEmployees.length > 0 ? (
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
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              assetCount={assetCountsMap[employee.name] || 0}
              onClick={handleSelectEmployee}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2.5,
            border: '1px dashed',
            borderColor: 'customColors.borderLight',
            bgcolor: 'background.paper',
            mt: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No employees found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No team members matched "{searchQuery}". Try searching for another name or department.
          </Typography>
          <AppButton variant="outline" size="sm" onClick={() => setSearchQuery('')}>
            Clear Search
          </AppButton>
        </Box>
      )}

      {/* Modals */}
      <AddEmployeeModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <ImportCSVModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(count) => {
          console.log(`Successfully imported ${count} employees from CSV.`);
        }}
      />
    </Box>
  );
}
