import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AppButton from '../AppButton';

interface AppearanceSettingsTabProps {
  onToggleTheme: () => void;
}

export default function AppearanceSettingsTab({ onToggleTheme }: AppearanceSettingsTabProps) {
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
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}
        >
          Appearance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mt: 0.25 }}>
          Customize the visual theme and layout density for your workspace.
        </Typography>
      </Box>

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
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>Interface Theme</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', mt: 0.25 }}>
            Currently using Light System theme.
          </Typography>
        </Box>
        <AppButton
          variant="outline"
          size="sm"
          onClick={onToggleTheme}
          sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
        >
          Light Theme
        </AppButton>
      </Paper>
    </Paper>
  );
}
