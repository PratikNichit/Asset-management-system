import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import AppButton from '../AppButton';

interface SecuritySettingsTabProps {
  onNotify: (msg: string) => void;
}

export default function SecuritySettingsTab({ onNotify }: SecuritySettingsTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword) {
      onNotify('Please enter both current and new passwords.');
      return;
    }
    onNotify('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
  };

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
        gap: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}
      >
        Security
      </Typography>

      {/* Section 1: Change password */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Change password</Typography>
        <TextField
          type="password"
          fullWidth
          size="small"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{
            maxWidth: 600,
            '& fieldset': { borderColor: 'customColors.borderLight' },
            '&:hover fieldset': { borderColor: 'primary.main' },
            '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
          }}
        />
        <TextField
          type="password"
          fullWidth
          size="small"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{
            maxWidth: 600,
            '& fieldset': { borderColor: 'customColors.borderLight' },
            '&:hover fieldset': { borderColor: 'primary.main' },
            '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
          }}
        />

        {(currentPassword || newPassword) && (
          <Box sx={{ pt: 0.5 }}>
            <AppButton variant="default" size="sm" onClick={handleSavePassword}>
              Update password
            </AppButton>
          </Box>
        )}
      </Box>

      {/* Section 2: Two-factor authentication card */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          borderColor: 'customColors.borderLight',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mt: 1,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>
            Two-factor authentication
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', mt: 0.25 }}>
            Require a code from your authenticator app.
          </Typography>
        </Box>

        <Switch
          checked={twoFactorAuth}
          onChange={(e) => {
            setTwoFactorAuth(e.target.checked);
            onNotify(
              e.target.checked
                ? 'Two-factor authentication enabled.'
                : 'Two-factor authentication disabled.'
            );
          }}
          color="primary"
        />
      </Paper>
    </Paper>
  );
}
