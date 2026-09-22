import { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AppButton from './AppButton';
import type { Employee } from '../types/employee';
import type { Asset } from '../types/asset';

interface AssignAssetModalProps {
  open: boolean;
  employee: Employee | null;
  availableAssets: Asset[];
  onClose: () => void;
  onConfirmAssign: (assetId: string, employeeName: string) => void;
}

const HEADING_FONT = '"Manrope", sans-serif';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function AssignAssetModal({
  open,
  employee,
  availableAssets,
  onClose,
  onConfirmAssign,
}: AssignAssetModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('');

  // Remember the last employee so the dialog can fade out smoothly
  // even if the parent clears `employee` the moment it closes.
  const lastEmployee = useRef<Employee | null>(employee);
  useEffect(() => {
    if (employee) lastEmployee.current = employee;
  }, [employee]);
  const current = employee ?? lastEmployee.current;

  if (!current) return null;

  // Guards against a stale id (e.g. the asset was assigned elsewhere meanwhile).
  const selectedAsset = availableAssets.find((asset) => asset.id === selectedAssetId);
  const firstName = current.name.split(' ')[0];
  const hasAssets = availableAssets.length > 0;

  const handleAssign = () => {
    if (!selectedAsset) return;
    onConfirmAssign(selectedAsset.id, current.name);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
        // Reset the selection only after the close animation finishes,
        // so the field doesn't blank out while the dialog is fading.
        transition: { onExited: () => setSelectedAssetId('') },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          px: 3,
          pt: 2.5,
          pb: 1,
        }}
      >
        {/* spans, because DialogTitle is already an <h2> */}
        <Box>
          <Typography
            component="span"
            variant="h6"
            sx={{ display: 'block', fontWeight: 800, fontFamily: HEADING_FONT, lineHeight: 1.3 }}
          >
            Assign asset to {firstName}
          </Typography>
          <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            Choose from unassigned inventory.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close" edge="end" sx={{ mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        {/* The wrapper adds top space, since DialogTitle + DialogContent
            resets the content's own padding-top. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'action.hover',
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: HEADING_FONT,
                color: 'primary.main',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              }}
            >
              {getInitials(current.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                {current.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {current.department}
              </Typography>
            </Box>
          </Box>

          {hasAssets ? (
            <TextField
              select
              autoFocus
              fullWidth
              label="Asset"
              value={selectedAsset ? selectedAsset.id : ''}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              slotProps={{
                select: {
                  MenuProps: {
                    slotProps: { paper: { sx: { maxHeight: 320, borderRadius: 2, mt: 0.5 } } },
                  },
                  renderValue: (value) => {
                    const asset = availableAssets.find((a) => a.id === value);
                    return asset ? `${asset.name} (${asset.code})` : '';
                  },
                },
              }}
            >
              {availableAssets.map((asset) => (
                <MenuItem key={asset.id} value={asset.id} sx={{ borderRadius: 1.5, mx: 0.75, my: 0.25, py: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      width: '100%',
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {asset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {asset.code}
                      </Typography>
                    </Box>
                    <Chip label={asset.category} size="small" variant="outlined" />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
                py: 3,
                px: 2,
                textAlign: 'center',
                borderRadius: 2,
                border: 1,
                borderStyle: 'dashed',
                borderColor: 'divider',
              }}
            >
              <Inventory2OutlinedIcon color="disabled" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                No assets available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Every asset in inventory is already assigned. Unassign one or add a new asset, then try again.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
        <AppButton variant="outline" size="sm" onClick={onClose}>
          Cancel
        </AppButton>
        <AppButton variant="default" size="sm" disabled={!selectedAsset} onClick={handleAssign}>
          Assign asset
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}