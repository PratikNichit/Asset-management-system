import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AppButton from './AppButton';
import type { LocationItem } from '../types/location';

interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (location: Omit<LocationItem, 'id'>) => void;
  isSaving?: boolean;
}

const LOCATION_TYPES: { label: string; icon: React.ReactNode }[] = [
  { label: 'Headquarters', icon: <ApartmentRoundedIcon fontSize="small" /> },
  { label: 'Office Branch', icon: <BusinessRoundedIcon fontSize="small" /> },
  { label: 'Manufacturing Plant', icon: <PrecisionManufacturingRoundedIcon fontSize="small" /> },
  { label: 'Warehouse', icon: <WarehouseRoundedIcon fontSize="small" /> },
  { label: 'Research & Development', icon: <ScienceRoundedIcon fontSize="small" /> },
  { label: 'Data Center', icon: <DnsRoundedIcon fontSize="small" /> },
  { label: 'Remote Hub', icon: <PublicRoundedIcon fontSize="small" /> },
];

const initialState = {
  name: '',
  address: '',
  type: 'Office Branch',
  assetsCount: 0 as number | '',
  employeesCount: 0 as number | '',
};

export default function AddLocationModal({ open, onClose, onAdd, isSaving }: AddLocationModalProps) {
  const [name, setName] = useState(initialState.name);
  const [address, setAddress] = useState(initialState.address);
  const [type, setType] = useState(initialState.type);
  const [assetsCount, setAssetsCount] = useState<number | ''>(initialState.assetsCount);
  const [employeesCount, setEmployeesCount] = useState<number | ''>(initialState.employeesCount);

  const resetForm = () => {
    setName(initialState.name);
    setAddress(initialState.address);
    setType(initialState.type);
    setAssetsCount(initialState.assetsCount);
    setEmployeesCount(initialState.employeesCount);
  };

  // The parent now controls closing on success (it may want to wait for the
  // save to actually finish first), so the draft can still be sitting in
  // local state when `open` flips to false. Reset it then, covering both
  // that case and a plain cancel/backdrop dismissal in one place.
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  // Cancelling or dismissing (backdrop click, escape) should discard the
  // draft rather than leaving stale values behind for next time the modal
  // opens. Ignored while a save is in flight so an accidental click-away
  // or Escape doesn't drop a request that's already underway.
  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || isSaving) return;

    onAdd({
      name: name.trim(),
      address: address.trim(),
      type,
      assetsCount: Number(assetsCount) || 0,
      employeesCount: Number(employeesCount) || 0,
    });

    // We let the parent control closing upon success.
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, overflow: 'hidden' },
        },
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            px: 3,
            pt: 3,
            pb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'primary.main',
                bgcolor: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(109, 93, 246, 0.1)'
                    : 'rgba(109, 93, 246, 0.18)',
              }}
            >
              <AddLocationAltRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', lineHeight: 1.3 }}
              >
                Create new location
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>
                Add a facility to track assets and staff against.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={isSaving} sx={{ mt: -0.25 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, px: 3, pt: 2.75 }}>
          <TextField
            label="Location name"
            required
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Plant 2 — Hyderabad"
          />

          <TextField
            label="Address / region"
            required
            fullWidth
            size="small"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. HITEC City, Hyderabad, IN"
          />

          <TextField
            select
            label="Facility type"
            fullWidth
            size="small"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {LOCATION_TYPES.map((t) => (
              <MenuItem key={t.label} value={t.label} sx={{ display: 'flex', gap: 1.25 }}>
                <Box sx={{ display: 'flex', color: 'text.secondary' }}>{t.icon}</Box>
                {t.label}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography
              sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.secondary', mb: 1.25 }}
            >
              Starting counts
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Assets"
                type="number"
                fullWidth
                size="small"
                value={assetsCount}
                onChange={(e) => {
                  const v = e.target.value;
                  setAssetsCount(v === '' ? '' : Math.max(0, Number(v)));
                }}
                slotProps={{
                  htmlInput: { min: 0 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory2OutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Employees"
                type="number"
                fullWidth
                size="small"
                value={employeesCount}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmployeesCount(v === '' ? '' : Math.max(0, Number(v)));
                }}
                slotProps={{
                  htmlInput: { min: 0 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupsOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', mt: 1 }}>
              You can add or adjust these later — starting at 0 is fine.
            </Typography>
          </Box>
        </DialogContent>

        <Divider sx={{ mt: 2.5 }} />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <AppButton variant="outline" size="sm" onClick={handleClose} disabled={isSaving}>
            Cancel
          </AppButton>
          <AppButton
            variant="default"
            size="sm"
            type="submit"
            disabled={!name.trim() || !address.trim() || isSaving}
            loading={isSaving}
          >
            Create location
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}