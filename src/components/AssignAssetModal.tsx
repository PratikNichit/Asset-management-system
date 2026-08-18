import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
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

export default function AssignAssetModal({
  open,
  employee,
  availableAssets,
  onClose,
  onConfirmAssign,
}: AssignAssetModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('');

  if (!employee) return null;

  const handleAssign = () => {
    if (!selectedAssetId) return;
    onConfirmAssign(selectedAssetId, employee.name);
    setSelectedAssetId('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Assign Asset to {employee.name.split(' ')[0]}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Select an available company asset from inventory to assign to <strong>{employee.name}</strong> ({employee.department}).
        </Typography>

        <TextField
          select
          label="Select Asset"
          fullWidth
          size="small"
          value={selectedAssetId}
          onChange={(e) => setSelectedAssetId(e.target.value)}
          helperText={availableAssets.length === 0 ? 'No unassigned assets currently available.' : ''}
        >
          {availableAssets.map((asset) => (
            <MenuItem key={asset.id} value={asset.id}>
              {asset.name} ({asset.code}) — {asset.category}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <AppButton variant="outline" size="sm" onClick={onClose}>
          Cancel
        </AppButton>
        <AppButton
          variant="default"
          size="sm"
          disabled={!selectedAssetId}
          onClick={handleAssign}
        >
          Confirm Assignment
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
