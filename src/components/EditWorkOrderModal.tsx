import { useState, useEffect } from 'react';
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
import type { WorkOrder, WorkOrderStatus } from '../redux/maintenanceSlice';

const STATUSES: WorkOrderStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];

interface EditWorkOrderModalProps {
  open: boolean;
  workOrder: WorkOrder | null;
  onClose: () => void;
  onSave: (updated: Partial<WorkOrder> & { id: string }) => void;
  isSaving?: boolean;
}

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.9rem' },
  '& label': { fontSize: '0.875rem' },
};

export default function EditWorkOrderModal({
  open, workOrder, onClose, onSave, isSaving = false,
}: EditWorkOrderModalProps) {
  const [form, setForm] = useState<Partial<WorkOrder> | null>(null);

  useEffect(() => {
    if (workOrder) setForm({ status: workOrder.status, costUsd: workOrder.costUsd, date: workOrder.date });
  }, [workOrder]);

  if (!form || !workOrder) return null;

  const handleChange = (field: keyof WorkOrder) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}>
              Edit Work Order
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {workOrder.id} - {workOrder.assetName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField label="Status" select value={form.status} onChange={handleChange('status')} fullWidth size="small" sx={inputSx}>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Date"
              type="date"
              value={form.date ?? ''}
              onChange={handleChange('date')}
              fullWidth size="small" sx={inputSx}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Cost (USD)"
              type="number"
              value={form.costUsd}
              onChange={(e) => setForm((prev) => prev ? { ...prev, costUsd: Number(e.target.value) } : prev)}
              fullWidth size="small" sx={inputSx}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={isSaving}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontFamily: '"Manrope", sans-serif', px: 2.5, borderColor: 'customColors.borderLight', color: 'text.primary' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onSave({ id: workOrder.id, ...form })} disabled={isSaving}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontFamily: '"Manrope", sans-serif', px: 2.5, bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' } }}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
