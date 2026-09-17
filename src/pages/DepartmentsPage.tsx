import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

import { useAppSelector } from '../app/hooks';
import { selectAllDepartments } from '../redux/departmentsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import DepartmentCard from '../components/DepartmentCard';
import NewDepartmentPage from './NewDepartmentPage';

export interface DepartmentsPageProps {
  organizationName?: string;
}

export default function DepartmentsPage({ organizationName = 'Atlas' }: DepartmentsPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const departments = useAppSelector(selectAllDepartments);

  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false);

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
            sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem', color: '#0F172A' }}
          >
            Departments
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.9rem', color: '#64748B' }}>
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
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </Box>
    </Box>
  );
}
