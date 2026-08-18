import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AppButton from './AppButton';
import type { Employee } from '../types/employee';

interface EditEmployeeModalProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Operations',
  'Production',
  'Quality',
  'Maintenance',
  'Finance',
  'Admin',
];

const LOCATIONS = [
  'HQ — Bengaluru',
  'Plant 1 — Pune',
  'Warehouse A',
  'Branch Office — Mumbai',
];

export default function EditEmployeeModal({ open, employee, onClose, onSave }: EditEmployeeModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('HQ — Bengaluru');
  const [joinedDate, setJoinedDate] = useState('');

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setRole(employee.role);
      setEmail(employee.email);
      setDepartment(employee.department);
      setLocation(employee.location);
      setJoinedDate(employee.joinedDate);
    }
  }, [employee]);

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) return;

    onSave({
      ...employee,
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      department,
      location,
      joinedDate,
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Edit Profile — {employee.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Job Role / Title"
              required
              fullWidth
              size="small"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </Box>

          <TextField
            label="Email Address"
            type="email"
            required
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              select
              label="Department"
              fullWidth
              size="small"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Office Location"
              fullWidth
              size="small"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATIONS.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Joined Date"
            type="date"
            fullWidth
            size="small"
            value={joinedDate}
            onChange={(e) => setJoinedDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <AppButton variant="outline" size="sm" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="default" size="sm" type="submit">
            Save Changes
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
