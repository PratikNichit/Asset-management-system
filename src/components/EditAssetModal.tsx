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
import type { Asset, AssetStatus } from '../types/asset';

const ASSET_STATUSES: AssetStatus[] = ['Available', 'In Use', 'Maintenance', 'Retired', 'Disposed'];

interface EditAssetModalProps {
  open: boolean;
  asset: Asset | null;
  onClose: () => void;
  onSave: (updatedAsset: Asset) => void;
  isSaving?: boolean;
}

export default function EditAssetModal({ open, asset, onClose, onSave, isSaving = false }: EditAssetModalProps) {
  const [form, setForm] = useState<Asset | null>(null);

  useEffect(() => {
    if (asset) setForm({ ...asset });
  }, [asset]);

  if (!form) return null;

  const handleChange = (field: keyof Asset) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
  };

  const handleSubmit = () => {
    if (form) onSave(form);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      fontSize: '0.9rem',
    },
    '& label': { fontSize: '0.875rem' },
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3, p: 0.5 } },
      }}
    >
      <DialogTitle sx={{ pt: 2.5, px: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: 'rgba(79,70,229,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EditOutlinedIcon sx={{ color: '#4F46E5', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}>
              Edit Asset
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {asset?.code}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Grid container spacing={2}>
          {/* Row 1 */}
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Asset Name"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Status"
              select
              value={form.status}
              onChange={handleChange('status')}
              fullWidth
              size="small"
              sx={inputSx}
            >
              {ASSET_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Row 2 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Serial / Barcode"
              value={form.serial}
              onChange={handleChange('serial')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Brand"
              value={form.brand ?? ''}
              onChange={handleChange('brand')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Model"
              value={form.model ?? ''}
              onChange={handleChange('model')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>

          {/* Row 3 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Category"
              value={form.category}
              onChange={handleChange('category')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Department"
              value={form.department}
              onChange={handleChange('department')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Location"
              value={form.location}
              onChange={handleChange('location')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>

          {/* Row 4 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Assigned To"
              value={form.assignedTo ?? ''}
              onChange={handleChange('assignedTo')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Warranty Expiry"
              type="date"
              value={form.warrantyExpiry ?? ''}
              onChange={handleChange('warrantyExpiry')}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Purchase Date"
              type="date"
              value={form.purchaseDate ?? ''}
              onChange={handleChange('purchaseDate')}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={inputSx}
            />
          </Grid>

          {/* Row 5 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Purchase Cost ($)"
              type="number"
              value={form.purchaseCost ?? ''}
              onChange={(e) => setForm((prev) => prev ? { ...prev, purchaseCost: Number(e.target.value) } : prev)}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Vendor"
              value={form.vendor ?? ''}
              onChange={handleChange('vendor')}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description"
              value={form.description ?? ''}
              onChange={handleChange('description')}
              fullWidth
              multiline
              rows={2}
              size="small"
              sx={inputSx}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSaving}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: '"Manrope", sans-serif',
            px: 2.5,
            borderColor: 'customColors.borderLight',
            color: 'text.primary',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSaving || !form.name.trim()}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: '"Manrope", sans-serif',
            px: 2.5,
            bgcolor: '#4F46E5',
            '&:hover': { bgcolor: '#4338CA' },
          }}
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
