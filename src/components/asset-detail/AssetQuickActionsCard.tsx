import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AppButton from '../AppButton';
import type { Asset } from '../../types/asset';

interface AssetQuickActionsCardProps {
  asset: Asset;
  onReassign?: (asset: Asset) => void;
}

export default function AssetQuickActionsCard({ asset, onReassign }: AssetQuickActionsCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Quick actions</Typography>

      <AppButton
        variant="ghost"
        size="sm"
        startIcon={<PersonAddAlt1OutlinedIcon sx={{ fontSize: 18 }} />}
        onClick={() => onReassign?.(asset)}
        sx={{
          justifyContent: 'flex-start',
          bgcolor: 'customColors.bgLight',
          color: 'text.primary',
          py: 1.25,
          px: 2,
          borderRadius: 2,
          '&:hover': { bgcolor: 'customColors.bgNeutral' },
        }}
      >
        Reassign
      </AppButton>

      <AppButton
        variant="ghost"
        size="sm"
        startIcon={<BuildOutlinedIcon sx={{ fontSize: 18 }} />}
        sx={{
          justifyContent: 'flex-start',
          bgcolor: 'customColors.bgLight',
          color: 'text.primary',
          py: 1.25,
          px: 2,
          borderRadius: 2,
          '&:hover': { bgcolor: 'customColors.bgNeutral' },
        }}
      >
        Log maintenance
      </AppButton>

      <AppButton
        variant="ghost"
        size="sm"
        startIcon={<DeleteOutlinedIcon sx={{ fontSize: 18, color: 'error.main' }} />}
        sx={{
          justifyContent: 'flex-start',
          bgcolor: 'customColors.bgLight',
          color: 'error.main',
          py: 1.25,
          px: 2,
          borderRadius: 2,
          '&:hover': { bgcolor: 'customColors.errorTransparent' },
        }}
      >
        Retire asset
      </AppButton>
    </Paper>
  );
}
