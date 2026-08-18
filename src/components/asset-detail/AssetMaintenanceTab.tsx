import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function AssetMaintenanceTab() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.98rem', mb: 1 }}>
        Maintenance Log
      </Typography>
      <Typography variant="body2" color="text.secondary">
        No recent maintenance services logged for this asset.
      </Typography>
    </Paper>
  );
}
