import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { LocationItem } from '../types/location';

const LOCATION_TYPES = ['Headquarters', 'Manufacturing', 'Warehouse', 'Research', 'Office', 'Remote', 'Other'];

interface EditLocationModalProps {
  open: boolean;
  location: LocationItem | null;
  onClose: () => void;
  onSave: (updated: LocationItem) => void;
  isSaving?: boolean;
}

// While editing, the two counts are kept as strings so the fields can be
// cleared and retyped (a numeric state turns an empty field into "0").
type Draft = Omit<LocationItem, 'assetsCount' | 'employeesCount'> & {
  assetsCount: string;
  employeesCount: string;
};

const toDraft = (l: LocationItem): Draft => ({
  ...l,
  type: l.type ?? 'Office', // so what the dropdown shows is what actually gets saved
  assetsCount: String(l.assetsCount),
  employeesCount: String(l.employeesCount),
});

const toCount = (value: string): number => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.9rem' },
  '& label': { fontSize: '0.875rem' },
};

export default function EditLocationModal({
  open, location, onClose, onSave, isSaving = false,
}: EditLocationModalProps) {
  const [form, setForm] = useState<Draft | null>(location ? toDraft(location) : null);
  const [prevLocation, setPrevLocation] = useState<LocationItem | null>(location);

  // Reset the form as soon as a different location is passed in (during render, so
  // the previous location's values never flash). When `location` becomes null the
  // form is kept, so the dialog content doesn't vanish during the close animation.
  if (location !== prevLocation) {
    setPrevLocation(location);
    if (location) setForm(toDraft(location));
  }

  if (!form) return null;

  const canSave = !isSaving && form.name.trim().length > 0;

  const handleTextChange =
    (field: 'name' | 'address' | 'type') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

  const handleCountChange =
    (field: 'assetsCount' | 'employeesCount') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      ...form,
      name: form.name.trim(),
      address: form.address.trim(),
      assetsCount: toCount(form.assetsCount),
      employeesCount: toCount(form.employeesCount),
    });
  };

  // If a location has a type that isn't in the list, keep it selectable
  // instead of triggering MUI's "out-of-range value" warning.
  const currentType = form.type ?? 'Office';
  const typeOptions = LOCATION_TYPES.includes(currentType)
    ? LOCATION_TYPES
    : [currentType, ...LOCATION_TYPES];

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit, // lets Enter submit the form
          sx: { borderRadius: 3, p: 0.5 },
        },
      }}
    >
      <DialogTitle sx={{ pt: 2.5, px: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EditOutlinedIcon sx={{ color: '#4F46E5', fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}>
            Edit Location
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Location Name"
              value={form.name}
              onChange={handleTextChange('name')}
              required
              autoFocus
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Type"
              select
              value={currentType}
              onChange={handleTextChange('type')}
              fullWidth
              size="small"
              sx={inputSx}
            >
              {typeOptions.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Address"
              value={form.address}
              onChange={handleTextChange('address')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Assets Count"
              type="number"
              value={form.assetsCount}
              onChange={handleCountChange('assetsCount')}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Employees Count"
              type="number"
              value={form.employeesCount}
              onChange={handleCountChange('employeesCount')}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
          disabled={isSaving}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontFamily: '"Manrope", sans-serif', px: 2.5, borderColor: 'customColors.borderLight', color: 'text.primary' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!canSave}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontFamily: '"Manrope", sans-serif', px: 2.5, bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' } }}
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}