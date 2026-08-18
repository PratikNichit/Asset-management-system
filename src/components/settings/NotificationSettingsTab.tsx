import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';

export default function NotificationSettingsTab() {
  const [notifWarrantyExpiring, setNotifWarrantyExpiring] = useState(true);
  const [notifMaintenanceOverdue, setNotifMaintenanceOverdue] = useState(true);
  const [notifAssetAssigned, setNotifAssetAssigned] = useState(true);
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(true);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3.5,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', mb: 1 }}
      >
        Email notifications
      </Typography>

      {/* Row 1: Warranty expiring */}
      <Box
        sx={{
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'customColors.borderLight',
        }}
      >
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 500 }}>Warranty expiring</Typography>
        <Switch
          checked={notifWarrantyExpiring}
          onChange={(e) => setNotifWarrantyExpiring(e.target.checked)}
          color="primary"
        />
      </Box>

      {/* Row 2: Maintenance overdue */}
      <Box
        sx={{
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'customColors.borderLight',
        }}
      >
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 500 }}>Maintenance overdue</Typography>
        <Switch
          checked={notifMaintenanceOverdue}
          onChange={(e) => setNotifMaintenanceOverdue(e.target.checked)}
          color="primary"
        />
      </Box>

      {/* Row 3: Asset assigned to me */}
      <Box
        sx={{
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'customColors.borderLight',
        }}
      >
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 500 }}>Asset assigned to me</Typography>
        <Switch
          checked={notifAssetAssigned}
          onChange={(e) => setNotifAssetAssigned(e.target.checked)}
          color="primary"
        />
      </Box>

      {/* Row 4: Weekly report */}
      <Box
        sx={{
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 500 }}>Weekly report</Typography>
        <Switch
          checked={notifWeeklyReport}
          onChange={(e) => setNotifWeeklyReport(e.target.checked)}
          color="primary"
        />
      </Box>
    </Paper>
  );
}
