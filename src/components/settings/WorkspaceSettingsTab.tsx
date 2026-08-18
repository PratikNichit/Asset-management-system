import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import AppButton from '../AppButton';

interface WorkspaceSettingsTabProps {
  onSave: () => void;
}

export default function WorkspaceSettingsTab({ onSave }: WorkspaceSettingsTabProps) {
  const [workspaceName, setWorkspaceName] = useState('Atlas Industries');
  const [workspaceUrl, setWorkspaceUrl] = useState('atlas.atlas.app');
  const [industry, setIndustry] = useState('Manufacturing');
  const [fiscalYearStart, setFiscalYearStart] = useState('2026-04-01');

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
        Workspace details
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>Name</Typography>
          <TextField
            fullWidth
            size="small"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            sx={{
              '& fieldset': { borderColor: 'customColors.borderLight' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>URL</Typography>
          <TextField
            fullWidth
            size="small"
            value={workspaceUrl}
            onChange={(e) => setWorkspaceUrl(e.target.value)}
            sx={{
              '& fieldset': { borderColor: 'customColors.borderLight' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>Industry</Typography>
          <TextField
            fullWidth
            size="small"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            sx={{
              '& fieldset': { borderColor: 'customColors.borderLight' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>
            Fiscal year start
          </Typography>
          <TextField
            type="date"
            fullWidth
            size="small"
            value={fiscalYearStart}
            onChange={(e) => setFiscalYearStart(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{
              '& fieldset': { borderColor: 'customColors.borderLight' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
        <AppButton variant="default" size="sm" onClick={onSave}>
          Save changes
        </AppButton>
      </Box>
    </Paper>
  );
}
