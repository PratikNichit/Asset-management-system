import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { fieldSx, labelSx } from './shared';

interface Props {
  state: any;
  setters: any;
  handlers: any;
}

export default function PurchaseWarrantyStep({ state, setters, handlers }: Props) {
  const { purchaseDate, purchaseCost, vendor, warrantyUntil } = state;
  const { setPurchaseDate, setPurchaseCost, setVendor, setWarrantyUntil, setTouched } = setters;
  const { showError } = handlers;

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}>
          Purchase & warranty
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
          Optional, but handy for depreciation and warranty tracking.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <Typography sx={labelSx}>Purchase date</Typography>
          <TextField
            fullWidth
            type="date"
            size="medium"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
            sx={fieldSx}
          />
        </Box>
        <Box>
          <Typography sx={labelSx}>Purchase cost</Typography>
          <TextField
            fullWidth
            type="number"
            size="medium"
            placeholder="0.00"
            value={purchaseCost}
            onChange={(e) => setPurchaseCost(e.target.value)}
            onBlur={() => setTouched((t: any) => ({ ...t, purchaseCost: true }))}
            error={Boolean(showError(1, 'purchaseCost'))}
            helperText={showError(1, 'purchaseCost') || ' '}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> } }}
            sx={fieldSx}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <Typography sx={labelSx}>Vendor</Typography>
          <TextField fullWidth size="medium" placeholder="Vendor name" value={vendor} onChange={(e) => setVendor(e.target.value)} sx={fieldSx} />
        </Box>
        <Box>
          <Typography sx={labelSx}>Warranty until</Typography>
          <TextField
            fullWidth
            type="date"
            size="medium"
            value={warrantyUntil}
            onChange={(e) => setWarrantyUntil(e.target.value)}
            onBlur={() => setTouched((t: any) => ({ ...t, warrantyUntil: true }))}
            error={Boolean(showError(1, 'warrantyUntil'))}
            helperText={showError(1, 'warrantyUntil') || ' '}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
            sx={fieldSx}
          />
        </Box>
      </Box>
    </>
  );
}
