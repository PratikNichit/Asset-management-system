import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';

export interface AssignAssetPageProps {
  organizationName?: string;
}

export default function AssignAssetPage({ organizationName = 'Atlas Industries' }: AssignAssetPageProps) {
  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([organizationName, 'Assign Asset']);
  }, [organizationName, setBreadcrumbs]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Assign Asset
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Allocate equipment and software licenses to personnel and departments.
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
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: '#20B46B1A', color: '#20B46B', mb: 2 }}>
          <AssignmentIndOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Asset Assignment Workflow
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          Assign available hardware, track custodian sign-offs, issue check-outs, and monitor return dates.
        </Typography>
        <AppButton variant="default">
          Start Assignment
        </AppButton>
      </Paper>
    </Box>
  );
}
