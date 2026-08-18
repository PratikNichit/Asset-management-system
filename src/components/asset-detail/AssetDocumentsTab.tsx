import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AppButton from '../AppButton';

export default function AssetDocumentsTab() {
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
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.98rem' }}>
        Attached Documents
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2, bgcolor: 'customColors.bgLight' }}>
        <InsertDriveFileOutlinedIcon sx={{ color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>Tax_Invoice_AST-00184.pdf</Typography>
          <Typography variant="caption" color="text.secondary">1.4 MB · Uploaded Feb 12, 2024</Typography>
        </Box>
        <AppButton variant="outline" size="sm">Download</AppButton>
      </Box>
    </Paper>
  );
}
