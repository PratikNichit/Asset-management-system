import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAllDepartments, addDepartment } from '../redux/departmentsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import DepartmentCard from '../components/DepartmentCard';
import AddDepartmentModal from '../components/AddDepartmentModal';
import type { Department } from '../types/department';

export interface DepartmentsPageProps {
  organizationName?: string;
}

export default function DepartmentsPage({ organizationName = 'Atlas' }: DepartmentsPageProps) {
  const { setBreadcrumbs } = useLayout();
  const dispatch = useAppDispatch();
  const departments = useAppSelector(selectAllDepartments);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Departments']);
  }, [organizationName, setBreadcrumbs]);

  const handleAddDepartment = (newDept: Omit<Department, 'id'>) => {
    dispatch(addDepartment(newDept));
  };

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
            Departments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
            Organize people and assets by team.
          </Typography>
        </Box>

        <AppButton
          variant="default"
          size="sm"
          startIcon={<AddIcon />}
          onClick={() => setIsAddModalOpen(true)}
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
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </Box>

      {/* ── Add Department Modal ─────────────────────────────────────────────── */}
      <AddDepartmentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDepartment}
      />
    </Box>
  );
}
