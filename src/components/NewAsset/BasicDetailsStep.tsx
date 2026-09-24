import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { fieldSx, labelSx } from './shared';

interface Props {
  state: any;
  setters: any;
  handlers: any;
  categoriesList: { id: string; name: string }[];
}

export default function BasicDetailsStep({ state, setters, handlers, categoriesList }: Props) {
  const { assetName, assetId, serialNumber, category, brand, model } = state;
  const { setAssetName, setSerialNumber, setCategory, setBrand, setModel, setTouched } = setters;
  const { showError } = handlers;

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}>
          Basic information
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
          Give this asset a name and a category so it's easy to find later.
        </Typography>
      </Box>

      <Box>
        <Typography sx={labelSx}>
          Asset name <span style={{ color: '#D32F2F' }}>*</span>
        </Typography>
        <TextField
          fullWidth
          size="medium"
          placeholder='e.g. MacBook Pro 16"'
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          onBlur={() => setTouched((t: any) => ({ ...t, assetName: true }))}
          error={Boolean(showError(0, 'assetName'))}
          helperText={showError(0, 'assetName') || ' '}
          sx={fieldSx}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <Typography sx={labelSx}>
            Asset ID <span style={{ fontWeight: 400, color: 'text.secondary' as string }}>· Auto-generated</span>
          </Typography>
          <TextField
            fullWidth
            size="medium"
            disabled
            value={assetId}
            sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], bgcolor: 'background.default' } }}
          />
        </Box>
        <Box>
          <Typography sx={labelSx}>Serial number</Typography>
          <TextField
            fullWidth
            size="medium"
            placeholder="e.g. C02XL0GJHV29"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            sx={fieldSx}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <Typography sx={labelSx}>
            Category <span style={{ color: '#D32F2F' }}>*</span>
          </Typography>
          <TextField
            select
            fullWidth
            size="medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => setTouched((t: any) => ({ ...t, category: true }))}
            error={Boolean(showError(0, 'category'))}
            helperText={showError(0, 'category') || ' '}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (selected: unknown) => {
                  if (!selected || selected === '') return <span style={{ color: '#94A3B8' }}>Select category</span>;
                  const found = categoriesList.find(c => c.id === selected);
                  return found ? found.name : String(selected);
                }
              },
            }}
            sx={fieldSx}
          >
            <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Select category
            </MenuItem>
            {categoriesList.map((cat) => (
              <MenuItem key={cat.id} value={cat.id} sx={{ fontSize: '0.9rem' }}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <Typography sx={labelSx}>Brand</Typography>
          <TextField fullWidth size="medium" placeholder="e.g. Apple" value={brand} onChange={(e) => setBrand(e.target.value)} sx={fieldSx} />
        </Box>
        <Box>
          <Typography sx={labelSx}>Model</Typography>
          <TextField fullWidth size="medium" placeholder="e.g. A2991" value={model} onChange={(e) => setModel(e.target.value)} sx={fieldSx} />
        </Box>
      </Box>
    </>
  );
}
