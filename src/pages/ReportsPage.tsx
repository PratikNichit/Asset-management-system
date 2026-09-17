import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';

export interface ReportsPageProps {
  organizationName?: string;
}

export default function ReportsPage({ organizationName = 'Atlas Industries' }: ReportsPageProps) {
  const { setBreadcrumbLinks } = useLayout();

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Reports' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Depreciation reports, utilization analytics, compliance audits, and financial exports.
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
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: '#5159D71A', color: '#5159D7', mb: 2 }}>
          <BarChartOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Enterprise Reports Generator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          Generate audit-ready reports on total cost of ownership, asset depreciation schedules, and active warranty expirations.
        </Typography>
        <AppButton variant="default">
          Generate Report
        </AppButton>
      </Paper>
    </Box>
  );
}
