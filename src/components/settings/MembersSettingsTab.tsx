import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function MembersSettingsTab() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3.5,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', mb: 1 }}
      >
        Team members
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
        Invite teammates from the top-right menu. Role management is available on Pro plans.
      </Typography>
    </Paper>
  );
}
