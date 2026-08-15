import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';

export interface NotificationsPageProps {
  organizationName?: string;
}

export default function NotificationsPage({ organizationName = 'Atlas Industries' }: NotificationsPageProps) {
  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Notifications']);
  }, [organizationName, setBreadcrumbs]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Notifications & System Alerts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Warranty expiration warnings, maintenance reminders, and check-in overdue alerts.
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
          <NotificationsOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Notification Center
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          Configure automated email digest rules, warranty renewal alerts, and maintenance escalation notifications.
        </Typography>
        <AppButton variant="default">
          Configure Alert Rules
        </AppButton>
      </Paper>
    </Box>
  );
}
