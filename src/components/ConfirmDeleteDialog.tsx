import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  entityName?: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  title = 'Delete item?',
  description,
  entityName,
  onClose,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxWidth: 420,
            width: '100%',
            p: 0.5,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon sx={{ color: '#EF4444', fontSize: 22 }} />
          </Box>
          <Typography
            sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif', fontSize: '1.05rem' }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
          {description ?? (
            <>
              Are you sure you want to delete{' '}
              {entityName ? (
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  "{entityName}"
                </Box>
              ) : (
                'this item'
              )}
              ? This action <Box component="span" sx={{ fontWeight: 700, color: '#EF4444' }}>cannot be undone</Box>.
            </>
          )}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isDeleting}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: '"Manrope", sans-serif',
            px: 2.5,
            borderColor: 'customColors.borderLight',
            color: 'text.primary',
            '&:hover': { borderColor: 'text.primary', bgcolor: 'transparent' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
          startIcon={<DeleteOutlinedIcon />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: '"Manrope", sans-serif',
            px: 2.5,
            bgcolor: '#EF4444',
            '&:hover': { bgcolor: '#DC2626' },
            '&.Mui-disabled': { opacity: 0.6 },
          }}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
