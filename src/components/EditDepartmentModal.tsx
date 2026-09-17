import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { Department } from '../types/department';

interface EditDepartmentModalProps {
  open: boolean;
  department: Department | null;
  onClose: () => void;
  onSave: (updated: Department) => void;
  isSaving?: boolean;
}

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.9rem' },
  '& label': { fontSize: '0.875rem' },
};

export default function EditDepartmentModal({
  open, department, onClose, onSave, isSaving = false,
}: EditDepartmentModalProps) {
  const [form, setForm] = useState<Department | null>(null);

  useEffect(() => {
    if (department) setForm({ ...department });
  }, [department]);

  if (!form) return null;

  const handleChange = (field: keyof Department) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 0.5 } } }}
    >
      <DialogTitle sx={{ pt: 2.5, px: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EditOutlinedIcon sx={{ color: '#4F46E5', fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}>
            Edit Department
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField label="Department Name" value={form.name} onChange={handleChange('name')} fullWidth size="small" sx={inputSx} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Code (2 letters)" value={form.code} onChange={handleChange('code')} fullWidth size="small" slotProps={{ htmlInput: { maxLength: 3 } }} sx={inputSx} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField label="Department Head" value={form.head} onChange={handleChange('head')} fullWidth size="small" sx={inputSx} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Members Count"
              type="number"
              value={form.membersCount}
              onChange={(e) => setForm((prev) => prev ? { ...prev, membersCount: Number(e.target.value) } : prev)}
              fullWidth size="small" sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Assets Count"
              type="number"
              value={form.assetsCount}
              onChange={(e) => setForm((prev) => prev ? { ...prev, assetsCount: Number(e.target.value) } : prev)}
              fullWidth size="small" sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField label="Primary Location" value={form.primaryLocation ?? ''} onChange={handleChange('primaryLocation')} fullWidth size="small" sx={inputSx} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField label="Description" value={form.description ?? ''} onChange={handleChange('description')} fullWidth multiline rows={2} size="small" sx={inputSx} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={isSaving}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontFamily: '"Manrope", sans-serif', px: 2.5, borderColor: 'customColors.borderLight', color: 'text.primary' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={isSaving || !form.name.trim()}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontFamily: '"Manrope", sans-serif', px: 2.5, bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' } }}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
