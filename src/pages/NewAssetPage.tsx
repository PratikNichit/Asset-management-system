import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import { useAppSelector } from '../app/hooks';
import { selectAllCategories } from '../redux/categoriesSlice';
import { selectAllDepartments } from '../redux/departmentsSlice';
import { selectAllLocations } from '../redux/locationsSlice';
import { selectAllEmployeesList } from '../redux/employeesSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import type { Asset, AssetStatus } from '../types/asset';

export interface NewAssetPageProps {
  organizationName?: string;
  onCancel?: () => void;
  onSuccess?: (newAsset: Asset) => void;
}

const DEFAULT_CATEGORIES = [
  'Laptops',
  'Monitors',
  'Machines',
  'Molds',
  'Forklifts',
  'Peripherals',
  'Furniture',
  'Software Licenses',
];

const STATUS_OPTIONS: AssetStatus[] = [
  'Available',
  'In Use',
  'Maintenance',
  'Under Maintenance',
  'Retired',
  'Disposed',
];

export default function NewAssetPage({
  organizationName = 'Atlas',
  onCancel,
  onSuccess,
}: NewAssetPageProps) {
  const { setBreadcrumbLinks } = useLayout();

  const reduxCategories = useAppSelector(selectAllCategories);
  const reduxDepartments = useAppSelector(selectAllDepartments);
  const reduxLocations = useAppSelector(selectAllLocations);
  const reduxEmployees = useAppSelector(selectAllEmployeesList);

  const categoriesList = reduxCategories.length > 0 ? reduxCategories.map((c) => c.name) : DEFAULT_CATEGORIES;
  const departmentsList = reduxDepartments.length > 0 ? reduxDepartments.map((d) => d.name) : ['Engineering', 'Design', 'Operations', 'Production', 'Quality', 'Maintenance', 'Admin', 'Finance'];
  const locationsList = reduxLocations.length > 0 ? reduxLocations.map((l) => l.name) : ['HQ — Bengaluru', 'Plant 1 — Pune', 'Warehouse A', 'R&D Lab'];

  // Form State
  const [assetName, setAssetName] = useState('');
  const [assetId] = useState('AST-01301');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('A2991');

  // Purchase & Warranty State
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('0.00');
  const [vendor, setVendor] = useState('');
  const [warrantyUntil, setWarrantyUntil] = useState('');

  // Assignment State
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('Unassigned');
  const [status, setStatus] = useState<AssetStatus>('Available');

  // Description
  const [description, setDescription] = useState('');

  // Media State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150&auto=format&fit=crop&q=80',
  ]);
  const [documents, setDocuments] = useState<string[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Assets', path: '/assets' },
      { label: 'New Asset' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImageUrls]);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map((f) => f.name);
      setDocuments((prev) => [...prev, ...newDocs]);
      setToastMessage(`Uploaded document: ${files[0].name}`);
    }
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft && !assetName.trim()) {
      setToastMessage('Please enter an asset name.');
      return;
    }

    if (!isDraft && !category) {
      setToastMessage('Please select a category.');
      return;
    }

    const createdAsset: Asset = {
      id: assetId,
      code: assetId,
      name: assetName.trim() || 'Untitled Asset',
      category: category || 'General',
      serial: serialNumber.trim() || 'N/A',
      department: department || 'Unassigned',
      location: location || 'HQ — Bengaluru',
      assignedTo: assignedEmployee !== 'Unassigned' ? assignedEmployee : null,
      warrantyExpiry: warrantyUntil || null,
      status: status,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      purchaseDate: purchaseDate || undefined,
      purchaseCost: Number(purchaseCost) || 0,
      vendor: vendor.trim() || undefined,
      description: description.trim() || undefined,
      images,
      documents,
    };

    if (onSuccess) {
      onSuccess(createdAsset);
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, maxWidth: 1120, mx: 'auto', width: '100%' }}>
      {/* ── Top Header Bar with Action Buttons ─────────────────────────────── */}
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
            sx={{
              fontWeight: 800,
              fontFamily: '"Manrope", sans-serif',
              fontSize: '1.75rem',
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            New asset
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: '0.9rem',
              color: 'text.secondary',
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            Add an asset to your workspace inventory.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onCancel && (
            <AppButton
              variant="ghost"
              size="sm"
              startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
              onClick={onCancel}
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.9rem',
                fontFamily: '"Manrope", sans-serif',
                px: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              Cancel
            </AppButton>
          )}

          <AppButton
            variant="outline"
            size="sm"
            onClick={() => {
              setToastMessage('Draft saved successfully.');
            }}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              fontWeight: 600,
              fontFamily: '"Manrope", sans-serif',
              textTransform: 'none',
              px: 2,
              py: 0.9,
              '&:hover': {
                borderColor: 'text.secondary',
                bgcolor: 'background.default',
              },
            }}
          >
            Save as draft
          </AppButton>

          <AppButton
            variant="default"
            size="sm"
            onClick={() => handleSubmit(false)}
            sx={{
              bgcolor: 'primary.main',
              borderRadius: '10px',
              px: 2.2,
              py: 1,
              fontWeight: 600,
              fontFamily: '"Manrope", sans-serif',
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Create asset
          </AppButton>
        </Box>
      </Box>

      {/* ── Main Form Layout (2 Columns: Left 8 cols, Right 4 cols) ───────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT COLUMN: Form Cards Stack ───────────────────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 1. Basic Information Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
              >
                Basic information
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
                Name, category and identifiers.
              </Typography>
            </Box>

            {/* Asset Name */}
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                Asset name <span style={{ color: 'error.main' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="medium"
                placeholder='e.g. MacBook Pro 16"'
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '0.925rem',
                    bgcolor: 'background.paper',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.secondary' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                  },
                }}
              />
            </Box>

            {/* Row 2: Asset ID & Serial number */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Asset ID <span style={{ fontWeight: 400, color: 'text.secondary' }}>· Auto-generated</span>
                </Typography>
                <TextField
                  fullWidth
                  size="medium"
                  disabled
                  value={assetId}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.default',
                      '& fieldset': { borderColor: 'divider' },
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: 'text.secondary',
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Serial number
                </Typography>
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="e.g. C02XL0GJHV29"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Row 3: Category, Brand, Model */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr 1fr' }, gap: 2.5 }}>
              {/* Category Dropdown */}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Category <span style={{ color: 'error.main' }}>*</span>
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="medium"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  slotProps={{
                    select: {
                      displayEmpty: true,
                      renderValue: (selected: unknown) => {
                        if (!selected || selected === '') {
                          return <span style={{ color: 'text.secondary' }}>Select category</span>;
                        }
                        return String(selected);
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    Select category
                  </MenuItem>
                  {categoriesList.map((cat) => (
                    <MenuItem key={cat} value={cat} sx={{ fontSize: '0.9rem' }}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Brand */}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Brand
                </Typography>
                <TextField
                  fullWidth
                  size="medium"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                />
              </Box>

              {/* Model */}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Model
                </Typography>
                <TextField
                  fullWidth
                  size="medium"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* 2. Purchase & Warranty Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
              >
                Purchase & warranty
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
                Financial and vendor information.
              </Typography>
            </Box>

            {/* Row 1: Purchase date & Purchase cost */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Purchase date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  size="medium"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Purchase cost
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  size="medium"
                  placeholder="0.00"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Row 2: Vendor & Warranty until */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Vendor
                </Typography>
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="Vendor name"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Warranty until
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  size="medium"
                  value={warrantyUntil}
                  onChange={(e) => setWarrantyUntil(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* 3. Assignment Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
              >
                Assignment
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
                Where and to whom this asset belongs.
              </Typography>
            </Box>

            {/* Row 1: Department & Location */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              {/* Department */}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Department
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="medium"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  slotProps={{
                    select: {
                      displayEmpty: true,
                      renderValue: (selected: unknown) => {
                        if (!selected || selected === '') {
                          return <span style={{ color: 'text.secondary' }}>Select department</span>;
                        }
                        return String(selected);
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    Select department
                  </MenuItem>
                  {departmentsList.map((d) => (
                    <MenuItem key={d} value={d} sx={{ fontSize: '0.9rem' }}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Location */}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Location
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="medium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  slotProps={{
                    select: {
                      displayEmpty: true,
                      renderValue: (selected: unknown) => {
                        if (!selected || selected === '') {
                          return <span style={{ color: 'text.secondary' }}>Select location</span>;
                        }
                        return String(selected);
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    Select location
                  </MenuItem>
                  {locationsList.map((l) => (
                    <MenuItem key={l} value={l} sx={{ fontSize: '0.9rem' }}>
                      {l}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Row 2: Assigned employee & Status */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              {/* Assigned employee */}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Assigned employee
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="medium"
                  value={assignedEmployee}
                  onChange={(e) => setAssignedEmployee(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                >
                  <MenuItem value="Unassigned" sx={{ fontSize: '0.9rem' }}>
                    Unassigned
                  </MenuItem>
                  {reduxEmployees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.name} sx={{ fontSize: '0.9rem' }}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Status */}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mb: 0.85 }}>
                  Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="medium"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AssetStatus)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.925rem',
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                    },
                  }}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <MenuItem key={st} value={st} sx={{ fontSize: '0.9rem' }}>
                      {st}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Paper>

          {/* 4. Description Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
            >
              Description
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Notes, condition, accessories included..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.925rem',
                  bgcolor: 'background.paper',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                },
              }}
            />
          </Paper>
        </Box>

        {/* ── RIGHT COLUMN: Media & Tips Cards ─────────────────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card 1: Images Upload */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
            >
              Images
            </Typography>

            {/* Hidden file input */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />

            {/* Drag & drop dropzone container */}
            <Box
              onClick={() => imageInputRef.current?.click()}
              sx={{
                border: '2px dashed #CBD5E1',
                borderRadius: 2.5,
                p: 3.5,
                textAlign: 'center',
                bgcolor: 'background.default',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ImageOutlinedIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  fontFamily: '"Manrope", sans-serif',
                }}
              >
                Drag & drop or browse
              </Typography>
            </Box>

            {/* Thumbnail previews row */}
            {images.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', pt: 0.5 }}>
                {images.map((imgUrl, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: 'relative',
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: 'action.hover',
                      border: 1, borderColor: 'divider',
                    }}
                  >
                    <Box
                      component="img"
                      src={imgUrl}
                      alt={`Asset preview ${idx + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Circle X remove button */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: 18,
                        height: 18,
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        p: 0,
                        '&:hover': {
                          bgcolor: 'error.main',
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Card 2: Documents Upload */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
            >
              Documents
            </Typography>

            <input
              type="file"
              ref={docInputRef}
              onChange={handleDocumentUpload}
              accept=".pdf,.doc,.docx,.xlsx,.txt"
              style={{ display: 'none' }}
            />

            {/* Document Upload Pill bar */}
            <Box
              onClick={() => docInputRef.current?.click()}
              sx={{
                bgcolor: 'background.default',
                border: 1, borderColor: 'divider',
                borderRadius: 2,
                p: 1.5,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: 'text.secondary',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <FileUploadOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 400 }}>
                Upload Invoice, warranty...
              </Typography>
            </Box>

            {documents.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {documents.map((doc, i) => (
                  <Typography key={i} sx={{ fontSize: '0.8rem', color: 'text.primary', fontWeight: 500 }}>
                    📄 {doc}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>

          {/* Card 3: Tip Callout Container */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.85rem',
                color: 'text.secondary',
                lineHeight: 1.5,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Tip: use the QR label from the asset detail page to physically tag this asset after creating it.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Snackbar notification toast */}
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
