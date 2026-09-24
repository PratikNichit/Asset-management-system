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
  onDelete?: (asset: Asset) => void;
}

export default function AssetDetailHeader({ asset, onBack, onEdit, onDelete }: AssetDetailHeaderProps) {
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
          {asset.code} · {asset.category}
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
          onClick={() => onDelete?.(asset)}
          sx={{ borderColor: 'rgba(239,68,68,0.4)', color: 'error.main', bgcolor: 'background.paper', '&:hover': { bgcolor: 'rgba(239,68,68,0.06)', borderColor: 'error.main' } }}
        >
          <DeleteOutlinedIcon fontSize="small" />
        </AppButton>
      </Box>
    </Box>
  );
}
