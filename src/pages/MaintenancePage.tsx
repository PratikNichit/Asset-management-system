import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';

export interface MaintenancePageProps {
  organizationName?: string;
}

export default function MaintenancePage({ organizationName = 'Atlas Industries' }: MaintenancePageProps) {
  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Maintenance']);
  }, [organizationName, setBreadcrumbs]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Maintenance & Repair
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Schedule repairs, track servicing history, and manage work orders.
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
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: '#EFA8311A', color: '#EFA831', mb: 2 }}>
          <BuildOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Maintenance Tickets & Schedule
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          Log incident tickets, track vendor service history, and set preventive maintenance schedules.
        </Typography>
        <AppButton variant="default">
          Create Work Order
        </AppButton>
      </Paper>
    </Box>
  );
}
