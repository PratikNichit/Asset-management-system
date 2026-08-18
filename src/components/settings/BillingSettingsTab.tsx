import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AppButton from '../AppButton';

interface BillingSettingsTabProps {
  onManageSubscription: () => void;
}

export default function BillingSettingsTab({ onManageSubscription }: BillingSettingsTabProps) {
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
        gap: 2.5,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}
      >
        Billing
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          borderColor: 'customColors.borderLight',
          bgcolor: 'customColors.bgLight',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'text.primary' }}>
            Pro plan · $29/user/month
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', mt: 0.25 }}>
            Renews July 30, 2026 · 24 seats
          </Typography>
        </Box>

        <AppButton
          variant="outline"
          size="sm"
          onClick={onManageSubscription}
          sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
        >
          Manage subscription
        </AppButton>
      </Paper>
    </Paper>
  );
}
