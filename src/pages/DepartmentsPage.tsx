import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';

export interface DepartmentsPageProps {
  organizationName?: string;
}

export default function DepartmentsPage({ organizationName = 'Atlas Industries' }: DepartmentsPageProps) {
  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Departments']);
  }, [organizationName, setBreadcrumbs]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Departments & Business Units
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage organizational units, cost centers, and department asset budgets.
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
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: '#009BD81A', color: '#009BD8', mb: 2 }}>
          <ApartmentOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Department Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          Organize enterprise cost centers, departmental asset quotas, and department head assignments.
        </Typography>
        <AppButton variant="default">
          Add Department
        </AppButton>
      </Paper>
    </Box>
  );
}
