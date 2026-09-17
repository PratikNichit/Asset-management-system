import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addDepartment, selectAllDepartments } from '../redux/departmentsSlice';
import { selectAllEmployeesList } from '../redux/employeesSlice';
import { selectAllLocations } from '../redux/locationsSlice';
import { useLayout } from '../hooks/useLayout';
import AppButton from '../components/AppButton';
import type { Department } from '../types/department';

export interface NewDepartmentPageProps {
  organizationName?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function NewDepartmentPage({
  organizationName = 'Atlas',
  onCancel,
  onSuccess,
}: NewDepartmentPageProps) {
  const { setBreadcrumbLinks } = useLayout();
  const dispatch = useAppDispatch();

  const existingDepartments = useAppSelector(selectAllDepartments);
  const employees = useAppSelector(selectAllEmployeesList);
  const locations = useAppSelector(selectAllLocations);

  // Form State
  const [departmentName, setDepartmentName] = useState('');
  const [departmentHead, setDepartmentHead] = useState('');
  const [primaryLocation, setPrimaryLocation] = useState('');
  const [parentDepartment, setParentDepartment] = useState('None');
  const [costCenterCode, setCostCenterCode] = useState('');
  const [description, setDescription] = useState('');

  // UI Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumbLinks([
      { label: organizationName, path: '/dashboard' },
      { label: 'Departments', path: '/departments' },
      { label: 'New Department' },
    ]);
  }, [organizationName, setBreadcrumbLinks]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!departmentName.trim()) {
      setToastMessage('Please enter a department name.');
      return;
    }

    // Auto-generate 2-letter badge code from department name
    const generatedCode = departmentName.trim().substring(0, 2).toUpperCase();

    const newDept: Omit<Department, 'id'> = {
      name: departmentName.trim(),
      code: generatedCode,
      head: departmentHead.trim() || 'Unassigned',
      membersCount: 0,
      assetsCount: 0,
      primaryLocation: primaryLocation !== '' ? primaryLocation : undefined,
      parentDepartment: parentDepartment !== 'None' ? parentDepartment : undefined,
      costCenterCode: costCenterCode.trim() || undefined,
      description: description.trim() || undefined,
    };

    dispatch(addDepartment(newDept));

    if (onSuccess) {
      onSuccess();
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, maxWidth: 880, mx: 'auto', width: '100%' }}>
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
              color: '#0F172A',
              letterSpacing: '-0.02em',
            }}
          >
            New department
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: '0.9rem',
              color: '#64748B',
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            Group people and assets under an organizational unit.
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
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                fontFamily: '"Manrope", sans-serif',
                px: 1.5,
                '&:hover': {
                  bgcolor: '#F1F5F9',
                  color: '#0F172A',
                },
              }}
            >
              Cancel
            </AppButton>
          )}

          <AppButton
            variant="default"
            size="sm"
            startIcon={<ApartmentOutlinedIcon sx={{ fontSize: 19 }} />}
            onClick={() => handleSubmit()}
            sx={{
              bgcolor: '#4F46E5',
              borderRadius: '10px',
              px: 2.2,
              py: 1,
              fontWeight: 600,
              fontFamily: '"Manrope", sans-serif',
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
              '&:hover': {
                bgcolor: '#4338CA',
              },
            }}
          >
            Create department
          </AppButton>
        </Box>
      </Box>

      {/* ── Main Form Details Container Card ───────────────────────────────── */}
      <Paper
        variant="outlined"
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3.5,
          borderColor: '#E2E8F0',
          bgcolor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            fontFamily: '"Manrope", sans-serif',
            color: '#0F172A',
          }}
        >
          Details
        </Typography>

        {/* ── Row 1: Department Name ────────────────────────────────────────── */}
        <Box>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              mb: 0.85,
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            Department name <span style={{ color: '#EF4444' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            size="medium"
            placeholder="e.g. Quality Assurance"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.925rem',
                bgcolor: '#FFFFFF',
                '& fieldset': { borderColor: '#CBD5E1' },
                '&:hover fieldset': { borderColor: '#94A3B8' },
                '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '1.5px' },
              },
            }}
          />
        </Box>

        {/* ── Row 2: Department head & Primary location ────────────────────── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          {/* Department Head Dropdown */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                mb: 0.85,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Department head
            </Typography>
            <TextField
              select
              fullWidth
              size="medium"
              value={departmentHead}
              onChange={(e) => setDepartmentHead(e.target.value)}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected: unknown) => {
                    if (!selected || selected === '') {
                      return <span style={{ color: '#94A3B8' }}>Select person</span>;
                    }
                    return String(selected);
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.925rem',
                  bgcolor: '#FFFFFF',
                  '& fieldset': { borderColor: '#CBD5E1' },
                  '&:hover fieldset': { borderColor: '#94A3B8' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '1.5px' },
                },
              }}
            >
              <MenuItem value="" sx={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Select person
              </MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.name} sx={{ fontSize: '0.9rem' }}>
                  {emp.name} ({emp.role})
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Primary Location Dropdown */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                mb: 0.85,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Primary location
            </Typography>
            <TextField
              select
              fullWidth
              size="medium"
              value={primaryLocation}
              onChange={(e) => setPrimaryLocation(e.target.value)}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected: unknown) => {
                    if (!selected || selected === '') {
                      return <span style={{ color: '#94A3B8' }}>Select location</span>;
                    }
                    return String(selected);
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.925rem',
                  bgcolor: '#FFFFFF',
                  '& fieldset': { borderColor: '#CBD5E1' },
                  '&:hover fieldset': { borderColor: '#94A3B8' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '1.5px' },
                },
              }}
            >
              <MenuItem value="" sx={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Select location
              </MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc.id} value={loc.name} sx={{ fontSize: '0.9rem' }}>
                  {loc.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* ── Row 3: Parent department & Cost centre code ──────────────────── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          {/* Parent Department Dropdown */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                mb: 0.85,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Parent department
            </Typography>
            <TextField
              select
              fullWidth
              size="medium"
              value={parentDepartment}
              onChange={(e) => setParentDepartment(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.925rem',
                  bgcolor: '#FFFFFF',
                  '& fieldset': { borderColor: '#CBD5E1' },
                  '&:hover fieldset': { borderColor: '#94A3B8' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '1.5px' },
                },
              }}
            >
              <MenuItem value="None" sx={{ fontSize: '0.9rem' }}>
                None
              </MenuItem>
              {existingDepartments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name} sx={{ fontSize: '0.9rem' }}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Cost Centre Code */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                mb: 0.85,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Cost centre code
            </Typography>
            <TextField
              fullWidth
              size="medium"
              placeholder="e.g. CC-4021"
              value={costCenterCode}
              onChange={(e) => setCostCenterCode(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.925rem',
                  bgcolor: '#FFFFFF',
                  '& fieldset': { borderColor: '#CBD5E1' },
                  '&:hover fieldset': { borderColor: '#94A3B8' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '1.5px' },
                },
              }}
            />
          </Box>
        </Box>

        {/* ── Row 4: Description Multiline Textarea ────────────────────────── */}
        <Box>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              mb: 0.85,
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            Description
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="What this department is responsible for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.925rem',
                bgcolor: '#FFFFFF',
                '& fieldset': { borderColor: '#CBD5E1' },
                '&:hover fieldset': { borderColor: '#94A3B8' },
                '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '1.5px' },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Snackbar Notification Toast */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastMessage(null)} severity="warning" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
