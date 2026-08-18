import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import type { Asset } from '../../types/asset';

interface AssetTimelineTabProps {
  asset: Asset;
}

export default function AssetTimelineTab({ asset }: AssetTimelineTabProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.98rem', mb: 1 }}>
        Asset History Timeline
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <HistoryOutlinedIcon sx={{ color: 'primary.main' }} />
        <Typography variant="body2">
          Assigned to <strong>{asset.assignedTo || 'Priya Sharma'}</strong> on Mar 14, 2024
        </Typography>
      </Box>
    </Paper>
  );
}
