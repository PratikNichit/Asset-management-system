import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import AppButton from '../AppButton';

interface AssetQrCardProps {
  assetCode: string;
}

export default function AssetQrCard({ assetCode }: AssetQrCardProps) {
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
        justifyContent: 'space-between',
        minHeight: 380,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>QR code</Typography>
        <AppButton
          variant="ghost"
          size="sm"
          startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => window.print()}
          sx={{ color: 'text.secondary', px: 1 }}
        >
          Print
        </AppButton>
      </Box>

      {/* QR Code Canvas Representation */}
      <Box
        sx={{
          my: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="white" />
          {/* Outer positioning squares */}
          <rect x="5" y="5" width="28" height="28" fill="#1B1B1B" />
          <rect x="9" y="9" width="20" height="20" fill="white" />
          <rect x="13" y="13" width="12" height="12" fill="#1B1B1B" />

          <rect x="67" y="5" width="28" height="28" fill="#1B1B1B" />
          <rect x="71" y="9" width="20" height="20" fill="white" />
          <rect x="75" y="13" width="12" height="12" fill="#1B1B1B" />

          <rect x="5" y="67" width="28" height="28" fill="#1B1B1B" />
          <rect x="9" y="71" width="20" height="20" fill="white" />
          <rect x="13" y="75" width="12" height="12" fill="#1B1B1B" />

          {/* Data modules pattern */}
          <rect x="40" y="8" width="6" height="6" fill="#1B1B1B" />
          <rect x="52" y="8" width="6" height="6" fill="#1B1B1B" />
          <rect x="40" y="20" width="6" height="6" fill="#1B1B1B" />
          <rect x="52" y="20" width="6" height="6" fill="#1B1B1B" />
          <rect x="8" y="40" width="6" height="6" fill="#1B1B1B" />
          <rect x="20" y="40" width="6" height="6" fill="#1B1B1B" />
          <rect x="32" y="32" width="10" height="10" fill="#1B1B1B" />
          <rect x="46" y="32" width="10" height="10" fill="#1B1B1B" />
          <rect x="60" y="40" width="12" height="6" fill="#1B1B1B" />
          <rect x="78" y="40" width="14" height="6" fill="#1B1B1B" />
          <rect x="40" y="52" width="8" height="8" fill="#1B1B1B" />
          <rect x="54" y="52" width="8" height="8" fill="#1B1B1B" />
          <rect x="68" y="54" width="20" height="6" fill="#1B1B1B" />
          <rect x="40" y="68" width="12" height="6" fill="#1B1B1B" />
          <rect x="58" y="68" width="10" height="12" fill="#1B1B1B" />
          <rect x="74" y="68" width="12" height="12" fill="#1B1B1B" />
          <rect x="40" y="84" width="8" height="8" fill="#1B1B1B" />
          <rect x="54" y="84" width="14" height="8" fill="#1B1B1B" />
          <rect x="74" y="84" width="12" height="8" fill="#1B1B1B" />
        </svg>

        <Typography
          sx={{
            fontSize: '0.82rem',
            fontFamily: '"Roboto Mono", monospace',
            color: 'text.secondary',
            letterSpacing: '1px',
          }}
        >
          {assetCode}
        </Typography>
      </Box>
    </Paper>
  );
}
