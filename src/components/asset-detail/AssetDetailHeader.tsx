import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AppButton from '../AppButton';
import type { Asset } from '../../types/asset';

interface AssetDetailHeaderProps {
  asset: Asset;
  onBack: () => void;
  onEdit?: (asset: Asset) => void;
}

export default function AssetDetailHeader({ asset, onBack, onEdit }: AssetDetailHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
        >
          {asset.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.85rem',
            color: 'text.secondary',
            fontFamily: '"Roboto Mono", monospace',
            mt: 0.25,
          }}
        >
          {asset.code} · {asset.category} · Apple A2991
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AppButton
          variant="outline"
          size="sm"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
        >
          Back
        </AppButton>
        <AppButton
          variant="outline"
          size="sm"
          startIcon={<QrCodeOutlinedIcon />}
          onClick={() => window.print()}
          sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
        >
          QR label
        </AppButton>
        <AppButton
          variant="outline"
          size="sm"
          startIcon={<EditOutlinedIcon />}
          onClick={() => onEdit?.(asset)}
          sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
        >
          Edit
        </AppButton>
        <AppButton
          variant="outline"
          size="icon"
          sx={{ borderColor: 'customColors.borderLight', color: 'error.main', bgcolor: 'background.paper' }}
        >
          <DeleteOutlinedIcon fontSize="small" />
        </AppButton>
      </Box>
    </Box>
  );
}
