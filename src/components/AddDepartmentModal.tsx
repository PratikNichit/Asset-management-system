import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AppButton from './AppButton';
import type { Department } from '../types/department';

interface AddDepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (department: Omit<Department, 'id'>) => void;
}

export default function AddDepartmentModal({ open, onClose, onAdd }: AddDepartmentModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headId, setHeadId] = useState('');
  const [locationId, setLocationId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedCode = code.trim() || name.substring(0, 2).toUpperCase();

    onAdd({
      name: name.trim(),
      code: generatedCode.toUpperCase(),
      headId: headId || undefined,
      locationId: locationId || undefined,
    } as any);

    setName('');
    setCode('');
    setHeadId('');
    setLocationId('');
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
          sx: { borderRadius: 3, p: 1, bgcolor: 'background.paper', color: 'text.primary' },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Create New Department
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2 }}>
            <TextField
              label="Department Name"
              required
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Finance"
            />
            <TextField
              label="2-Letter Code"
              fullWidth
              size="small"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. FI"
              slotProps={{ htmlInput: { maxLength: 3 } }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Department Head ID"
              fullWidth
              size="small"
              value={headId}
              onChange={(e) => setHeadId(e.target.value)}
              placeholder="e.g. EMP-001"
            />
            <TextField
              label="Location ID"
              fullWidth
              size="small"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="e.g. LOC-001"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <AppButton variant="outline" size="sm" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="default" size="sm" type="submit" disabled={!name}>
            Create Department
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
