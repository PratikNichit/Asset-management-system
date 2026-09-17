import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

import { useAppDispatch } from '../app/hooks';
import { addCategory } from '../redux/categoriesSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import type { AssetCategoryItem, CategoryIconType } from '../types/category';

export interface NewCategoryPageProps {
  organizationName?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const PARENT_CATEGORIES = ['None', 'Hardware', 'IT Equipment', 'Heavy Machinery', 'Office Supplies', 'Vehicles'];

const DEPRECIATION_METHODS = ['Straight line', 'Declining balance', 'Sum-of-years-digits', 'None'];

const MAINTENANCE_INTERVALS = ['None', 'Monthly', 'Quarterly', 'Biannually', 'Annually'];

const COLOR_SWATCHES = [
  { hex: '#4F46E5', bg: '#EEF2FF', iconType: 'generic' as CategoryIconType },
  { hex: '#10B981', bg: '#DCFCE7', iconType: 'machine' as CategoryIconType },
  { hex: '#F59E0B', bg: '#FEF3C7', iconType: 'mold' as CategoryIconType },
  { hex: '#0284C7', bg: '#E0F2FE', iconType: 'monitor' as CategoryIconType },
  { hex: '#EF4444', bg: '#FEE2E2', iconType: 'forklift' as CategoryIconType },
  { hex: '#8B5CF6', bg: '#F3E8FF', iconType: 'peripheral' as CategoryIconType },
  { hex: '#3730A3', bg: '#EEF2FF', iconType: 'laptop' as CategoryIconType },
];

export default function NewCategoryPage({
  organizationName = 'Atlas',
  onCancel,
  onSuccess,
}: NewCategoryPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();

  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('None');
  const [description, setDescription] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Defaults State
  const [depreciationMethod, setDepreciationMethod] = useState('Straight line');
  const [usefulLifeYears, setUsefulLifeYears] = useState<number | ''>(5);
  const [maintenanceInterval, setMaintenanceInterval] = useState('None');
  const [requiresCalibration, setRequiresCalibration] = useState('No');

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Categories', path: '/categories' },
      { label: 'New Category' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!categoryName.trim()) {
      setToastMessage('Please enter a category name.');
      return;
    }

    const selectedSwatch = COLOR_SWATCHES[selectedColorIndex];

    const newCat: Omit<AssetCategoryItem, 'id'> = {
      name: categoryName.trim(),
      assetsCount: 0,
      iconType: selectedSwatch.iconType,
      bgColor: selectedSwatch.bg,
      iconColor: selectedSwatch.hex,
      description: description.trim() || undefined,
      parentCategory: parentCategory !== 'None' ? parentCategory : undefined,
      depreciationMethod,
      usefulLifeYears: Number(usefulLifeYears) || 5,
      maintenanceInterval,
      requiresCalibration: requiresCalibration === 'Yes',
    };

    dispatch(addCategory(newCat));
    setToastMessage(`Category "${categoryName.trim()}" created successfully.`);

    if (onSuccess) {
      onSuccess();
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, maxWidth: 880, mx: 'auto', width: '100%' }}>
      {/* ── Top Header Navigation Bar ───────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', fontSize: '1.75rem' }}
          >
            New category
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
            Classify assets and set defaults for depreciation and servicing.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onCancel && (
            <AppButton
              variant="outline"
              size="sm"
              startIcon={<ArrowBackIcon />}
              onClick={onCancel}
              sx={{ borderColor: 'customColors.borderLight', color: 'text.primary', bgcolor: 'background.paper' }}
            >
              Cancel
            </AppButton>
          )}
          <AppButton
            variant="default"
            size="sm"
            startIcon={<CategoryOutlinedIcon />}
            onClick={() => handleSubmit()}
          >
            Create category
          </AppButton>
        </Box>
      </Box>

      {/* ── Main Form Cards Stack ────────────────────────────────────────────── */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Card 1: Category details */}
        <Paper
          variant="outlined"
          sx={{
            p: 3.5,
            borderRadius: 2.5,
            borderColor: 'customColors.borderLight',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}
          >
            Category details
          </Typography>

          {/* Grid 2 Cols: Category name & Parent category */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            {/* Category name */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>
                Category name <span style={{ color: '#E62C2C' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Forklifts"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                sx={{
                  '& fieldset': { borderColor: 'customColors.borderLight' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
                }}
              />
            </Box>

            {/* Parent category */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>
                Parent category
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                sx={{
                  '& fieldset': { borderColor: 'customColors.borderLight' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
                }}
              >
                {PARENT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ fontSize: '0.88rem' }}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Description Textarea */}
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>Description</Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="What belongs in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                '& fieldset': { borderColor: 'customColors.borderLight' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
              }}
            />
          </Box>

          {/* Accent Color Swatch Picker */}
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 1.25 }}>Accent color</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {COLOR_SWATCHES.map((swatch, index) => {
                const isSelected = selectedColorIndex === index;
                return (
                  <Box
                    key={swatch.hex}
                    onClick={() => setSelectedColorIndex(index)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: swatch.hex,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      outline: isSelected ? `2.5px solid ${swatch.hex}` : 'none',
                      outlineOffset: 3,
                      '&:hover': {
                        transform: 'scale(1.15)',
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </Paper>

        {/* Card 2: Defaults */}
        <Paper
          variant="outlined"
          sx={{
            p: 3.5,
            borderRadius: 2.5,
            borderColor: 'customColors.borderLight',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}
            >
              Defaults
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.83rem', mt: 0.25 }}>
              Applied to every new asset in this category.
            </Typography>
          </Box>

          {/* Grid 2 Cols: Depreciation method & Useful life */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            {/* Depreciation method */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>
                Depreciation method
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={depreciationMethod}
                onChange={(e) => setDepreciationMethod(e.target.value)}
                sx={{
                  '& fieldset': { borderColor: 'customColors.borderLight' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
                }}
              >
                {DEPRECIATION_METHODS.map((method) => (
                  <MenuItem key={method} value={method} sx={{ fontSize: '0.88rem' }}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Useful life (years) */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>
                Useful life (years)
              </Typography>
              <TextField
                type="number"
                fullWidth
                size="small"
                value={usefulLifeYears}
                onChange={(e) =>
                  setUsefulLifeYears(e.target.value === '' ? '' : Number(e.target.value))
                }
                sx={{
                  '& fieldset': { borderColor: 'customColors.borderLight' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
                }}
              />
            </Box>

            {/* Maintenance interval */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>
                Maintenance interval
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={maintenanceInterval}
                onChange={(e) => setMaintenanceInterval(e.target.value)}
                sx={{
                  '& fieldset': { borderColor: 'customColors.borderLight' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
                }}
              >
                {MAINTENANCE_INTERVALS.map((interval) => (
                  <MenuItem key={interval} value={interval} sx={{ fontSize: '0.88rem' }}>
                    {interval}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Requires calibration */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.75 }}>
                Requires calibration
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={requiresCalibration}
                onChange={(e) => setRequiresCalibration(e.target.value)}
                sx={{
                  '& fieldset': { borderColor: 'customColors.borderLight' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
                }}
              >
                <MenuItem value="No" sx={{ fontSize: '0.88rem' }}>
                  No
                </MenuItem>
                <MenuItem value="Yes" sx={{ fontSize: '0.88rem' }}>
                  Yes
                </MenuItem>
              </TextField>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastMessage(null)} severity="info" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
