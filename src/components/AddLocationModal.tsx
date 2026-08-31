import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AppButton from './AppButton';
import type { LocationItem } from '../types/location';

interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (location: Omit<LocationItem, 'id'>) => void;
}

const LOCATION_TYPES = [
  'Headquarters',
  'Office Branch',
  'Manufacturing Plant',
  'Warehouse',
  'Research & Development',
  'Data Center',
  'Remote Hub',
];

export default function AddLocationModal({ open, onClose, onAdd }: AddLocationModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('Office Branch');
  const [assetsCount, setAssetsCount] = useState<number | ''>(0);
  const [employeesCount, setEmployeesCount] = useState<number | ''>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    onAdd({
      name: name.trim(),
      address: address.trim(),
      type,
      assetsCount: Number(assetsCount) || 0,
      employeesCount: Number(employeesCount) || 0,
    });

    setName('');
    setAddress('');
    setType('Office Branch');
    setAssetsCount(0);
    setEmployeesCount(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Create New Location
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Location Name"
            required
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Plant 2 — Hyderabad or Building C"
          />

          <TextField
            label="Address / Region"
            required
            fullWidth
            size="small"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. HITEC City, Hyderabad, IN"
          />

          <TextField
            select
            label="Facility Type"
            fullWidth
            size="small"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {LOCATION_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Initial Assets Count"
              type="number"
              fullWidth
              size="small"
              value={assetsCount}
              onChange={(e) => setAssetsCount(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <TextField
              label="Initial Employees Count"
              type="number"
              fullWidth
              size="small"
              value={employeesCount}
              onChange={(e) => setEmployeesCount(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <AppButton variant="outline" size="sm" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="default" size="sm" type="submit" disabled={!name.trim() || !address.trim()}>
            Create Location
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
