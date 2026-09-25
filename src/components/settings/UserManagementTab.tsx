import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import AppButton from '../AppButton';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
  clearUsersError,
} from '../../redux/usersSlice';
import type { User, UserRole, CreateUserPayload, UpdateUserPayload } from '../../types/user';
import { isAdminConfigured } from '../../lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features and settings' },
  { value: 'manager', label: 'Manager', description: 'Manage assets, employees and departments' },
  { value: 'technician', label: 'Technician', description: 'Handle maintenance work orders' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to the system' },
];

const ROLE_COLORS: Record<UserRole, { bg: string; color: string }> = {
  admin: { bg: alpha('#5159D7', 0.12), color: '#5159D7' },
  manager: { bg: alpha('#059669', 0.12), color: '#059669' },
  technician: { bg: alpha('#D97706', 0.12), color: '#D97706' },
  viewer: { bg: alpha('#64748B', 0.12), color: '#64748B' },
};

const inputSx = {
  '& fieldset': { borderColor: 'customColors.borderLight' },
  '&:hover fieldset': { borderColor: 'primary.main' },
  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.88rem' },
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

function getInitials(name: string, email: string): string {
  const words = name.trim().split(' ').filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  if (words.length === 1 && words[0].length >= 2) return words[0].slice(0, 2).toUpperCase();
  return email[0].toUpperCase();
}

const AVATAR_COLORS = ['#5159D7', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0284C7'];
function avatarColor(name: string): string {
  const code = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleChip({ role }: { role: UserRole }) {
  const { bg, color } = ROLE_COLORS[role] ?? ROLE_COLORS.viewer;
  const label = ROLES.find((r) => r.value === role)?.label ?? role;
  return (
    <Chip
      label={label}
      size="small"
      sx={{ fontSize: '0.7rem', fontWeight: 700, height: 22, bgcolor: bg, color, textTransform: 'capitalize' }}
    />
  );
}

function UserAvatar({ name, email }: { name: string; email: string }) {
  const color = avatarColor(name);
  return (
    <Avatar sx={{ width: 38, height: 38, bgcolor: alpha(color, 0.14), color, fontSize: '0.8rem', fontWeight: 700, border: `1.5px solid ${alpha(color, 0.22)}` }}>
      {getInitials(name, email)}
    </Avatar>
  );
}

// ─── Add / Edit Dialog ────────────────────────────────────────────────────────

interface UserDialogProps {
  open: boolean;
  mode: 'add' | 'edit';
  user: User | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

function UserDialog({ open, mode, user, onClose, onSuccess }: UserDialogProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUsersLoading);
  const sliceError = useAppSelector(selectUsersError);

  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'viewer' as UserRole });
  const [showPassword, setShowPassword] = useState(false);
  const [securityPassword, setSecurityPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && user) {
        setForm({ fullName: user.fullName, email: user.email, password: '', role: user.role });
      } else {
        setForm({ fullName: '', email: '', password: '', role: 'viewer' });
      }
      setSecurityPassword('');
      setLocalError(null);
      dispatch(clearUsersError());
    }
  }, [open, mode, user, dispatch]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setLocalError(null);
    dispatch(clearUsersError());
  };

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!form.email.trim() || !form.email.includes('@')) return 'A valid email address is required.';
    if (mode === 'add' && form.password.length < 8) return 'Password must be at least 8 characters.';
    if (securityPassword !== '@_Pratik@123_') return 'Incorrect security password.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setLocalError(err); return; }

    try {
      if (mode === 'add') {
        const payload: CreateUserPayload = {
          email: form.email.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
          role: form.role,
        };
        await dispatch(createUser(payload)).unwrap();
        onSuccess(`User "${form.fullName.trim()}" created. A confirmation email has been sent.`);
      } else if (user) {
        const payload: UpdateUserPayload = {
          id: user.id,
          fullName: form.fullName.trim(),
          role: form.role,
          ...(form.email.trim() !== user.email ? { email: form.email.trim() } : {}),
        };
        await dispatch(updateUser(payload)).unwrap();
        onSuccess(`"${form.fullName.trim()}" updated successfully.`);
      }
      onClose();
    } catch {
      // error surfaced via sliceError
    }
  };

  const displayError = localError ?? sliceError;
  const isAdd = mode === 'add';

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 0.5 } } }}
    >
      {/* Title */}
      <DialogTitle sx={{ pt: 2.5, px: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: 'rgba(81,89,215,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isAdd
              ? <PersonAddOutlinedIcon sx={{ color: '#5159D7', fontSize: 20 }} />
              : <EditOutlinedIcon sx={{ color: '#5159D7', fontSize: 20 }} />}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}>
              {isAdd ? 'Add new user' : 'Edit user'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAdd
                ? 'Registers via supabase.auth.signUp() — name stored in user_metadata.'
                : 'Updates name, email, or role.'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        {/* Info banner for add mode */}
        {isAdd && (
          <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>
            The new user will receive a <strong>confirmation email</strong>. They can log in after confirming.
            To skip confirmation, disable "Confirm email" in your Supabase Auth settings.
          </Alert>
        )}

        {displayError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
            {displayError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full name"
            value={form.fullName}
            onChange={handleChange('fullName')}
            fullWidth size="small"
            placeholder="e.g. Jordan Lee"
            sx={inputSx}
          />
          <TextField
            label="Email address"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            fullWidth size="small"
            placeholder="e.g. jordan@company.com"
            sx={inputSx}
          />
          {isAdd && (
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              fullWidth size="small"
              placeholder="Min 8 characters"
              sx={inputSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword((s) => !s)} edge="end">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          <TextField
            label="Role"
            select
            value={form.role}
            onChange={handleChange('role')}
            fullWidth size="small"
            sx={inputSx}
          >
            {ROLES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.description}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Security Password"
            type="password"
            value={securityPassword}
            onChange={(e) => { setSecurityPassword(e.target.value); setLocalError(null); }}
            fullWidth size="small"
            placeholder="Required for this action"
            sx={inputSx}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          variant="outlined" onClick={onClose} disabled={isLoading}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, borderColor: 'customColors.borderLight', color: 'text.primary' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained" onClick={handleSubmit} disabled={isLoading}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#5159D7', '&:hover': { bgcolor: '#4338CA' } }}
        >
          {isLoading
            ? (isAdd ? 'Creating…' : 'Saving…')
            : (isAdd ? 'Create user' : 'Save changes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

function DeleteDialog({ user, onClose, onSuccess }: { user: User | null; onClose: () => void; onSuccess: (msg: string) => void }) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUsersLoading);
  const sliceError = useAppSelector(selectUsersError);

  const [securityPassword, setSecurityPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSecurityPassword('');
      setLocalError(null);
    }
  }, [user]);

  const handleDelete = async () => {
    if (!user) return;
    if (securityPassword !== '@_Pratik@123_') {
      setLocalError('Incorrect security password.');
      return;
    }
    try {
      await dispatch(deleteUser(user.id)).unwrap();
      onSuccess(`"${user.fullName}" has been removed.`);
      onClose();
    } catch {
      // error shown below
    }
  };

  return (
    <Dialog
      open={Boolean(user)}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 0.5 } } }}
    >
      <DialogTitle sx={{ pt: 2.5, px: 3, pb: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}>
          Remove user?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 1.5 }}>
        {localError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
            {localError}
          </Alert>
        )}
        {sliceError && !localError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
            {sliceError}
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary">
          This will permanently delete <strong>{user?.fullName}</strong> ({user?.email}) from Supabase Auth.
          This action <strong>cannot be undone</strong>.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Security Password"
            type="password"
            value={securityPassword}
            onChange={(e) => { setSecurityPassword(e.target.value); setLocalError(null); }}
            fullWidth size="small"
            placeholder="Required for this action"
            sx={inputSx}
          />
        </Box>
        {!isAdminConfigured() && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2, fontSize: '0.8rem' }}>
            Deleting users requires <code>VITE_SUPABASE_SERVICE_ROLE_KEY</code> in your .env file.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          variant="outlined" onClick={onClose} disabled={isLoading}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, borderColor: 'customColors.borderLight', color: 'text.primary' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained" color="error" onClick={handleDelete} disabled={isLoading}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
        >
          {isLoading ? 'Removing…' : 'Yes, remove'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface UserManagementTabProps {
  onNotify: (message: string) => void;
}

export default function UserManagementTab({ onNotify }: UserManagementTabProps) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const isLoading = useAppSelector(selectUsersLoading);
  const sliceError = useAppSelector(selectUsersError);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const adminReady = isAdminConfigured();

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleOpenAdd = () => {
    setDialogMode('add');
    setSelectedUser(null);
    setDialogOpen(true);
    dispatch(clearUsersError());
  };

  const handleOpenEdit = (user: User) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setDialogOpen(true);
    dispatch(clearUsersError());
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (roleFilter === 'all' || u.role === roleFilter)
    );
  });

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3.5, borderRadius: 2.5, borderColor: 'customColors.borderLight', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif' }}>
            User management
          </Typography>
          {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.82rem' }}>
            Add users via{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 0.6, py: 0.15, borderRadius: 1, fontSize: '0.78rem' }}>
              supabase.auth.signUp()
            </Box>
            {' '}— name stored in{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 0.6, py: 0.15, borderRadius: 1, fontSize: '0.78rem' }}>
              user_metadata.full_name
            </Box>
            .
          </Typography> */}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh user list">
            <IconButton
              size="small"
              onClick={() => dispatch(fetchUsers())}
              disabled={isLoading}
              sx={{ border: '1px solid', borderColor: 'customColors.borderLight', borderRadius: 1.5 }}
            >
              <RefreshOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <AppButton variant="default" size="sm" startIcon={<PersonAddOutlinedIcon />} onClick={handleOpenAdd}>
            Add user
          </AppButton>
        </Box>
      </Box>

      {/* ── Listing limitation notice ───────────────────────────────────────── */}
      {!adminReady && (
        <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ borderRadius: 2, fontSize: '0.82rem' }}>
          <strong>Listing all users requires the service-role key.</strong> Without it, only the currently signed-in user is shown.
          Adding <code>VITE_SUPABASE_SERVICE_ROLE_KEY</code> to your <code>.env</code> will unlock the full user list.
          Creating new users works with just the anon key.
        </Alert>
      )}

      {/* ── Slice error ─────────────────────────────────────────────────────── */}
      {sliceError && !dialogOpen && !deleteTarget && (
        <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.82rem' }}>{sliceError}</Alert>
      )}

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[
          { label: 'Total users', value: users.length, icon: <GroupOutlinedIcon sx={{ fontSize: 18 }} />, color: '#5159D7' },
          { label: 'Confirmed', value: users.filter((u) => u.emailConfirmed).length, icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />, color: '#059669' },
          { label: 'Pending', value: users.filter((u) => !u.emailConfirmed).length, icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: 18 }} />, color: '#D97706' },
          { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18 }} />, color: '#7C3AED' },
        ].map((stat) => (
          <Paper
            key={stat.label}
            variant="outlined"
            sx={{ px: 2.5, py: 1.75, borderRadius: 2, borderColor: 'customColors.borderLight', display: 'flex', alignItems: 'center', gap: 1.5, flex: '1 1 120px', minWidth: 110 }}
          >
            <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: alpha(stat.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              {stat.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>
                {isLoading ? '—' : stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Search + filter ─────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 220, ...inputSx }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select size="small" value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          sx={{ width: 150, ...inputSx }}
        >
          <MenuItem value="all">All roles</MenuItem>
          {ROLES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
        </TextField>
      </Box>

      {/* ── User table ──────────────────────────────────────────────────────── */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        {/* Table head */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr auto', md: '1fr 200px 110px 120px 72px' },
            px: 2.5,
            py: 1.25,
            bgcolor: 'customColors.bgLight',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {['User', 'Email', 'Role', 'Status', 'Actions'].map((h, i) => (
            <Typography
              key={h}
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: { xs: i > 0 && i < 4 ? 'none' : 'block', md: 'block' },
              }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i}>
              {i > 0 && <Divider />}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr auto', md: '1fr 200px 110px 120px 72px' },
                  px: 2.5,
                  py: 1.75,
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="circular" width={38} height={38} />
                  <Box>
                    <Skeleton width={130} height={15} />
                    <Skeleton width={90} height={11} sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
                {[160, 60, 80].map((w) => (
                  <Skeleton key={w} width={w} height={22} sx={{ borderRadius: 5, display: { xs: 'none', md: 'block' } }} />
                ))}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Skeleton variant="circular" width={28} height={28} />
                  <Skeleton variant="circular" width={28} height={28} />
                </Box>
              </Box>
            </Box>
          ))
        ) : filtered.length === 0 ? (
          <Box sx={{ py: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <GroupOutlinedIcon sx={{ fontSize: 44, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              {search || roleFilter !== 'all'
                ? 'No users match your filters.'
                : 'No users yet. Click "Add user" to get started.'}
            </Typography>
          </Box>
        ) : (
          filtered.map((user, idx) => (
            <Box key={user.id}>
              {idx > 0 && <Divider />}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr auto', md: '1fr 200px 110px 120px 72px' },
                  px: 2.5,
                  py: 1.5,
                  alignItems: 'center',
                  gap: 1,
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {/* User */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  <UserAvatar name={user.fullName} email={user.email} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }} noWrap>
                      {user.fullName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Joined{' '}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                        : '—'}
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', display: { xs: 'none', md: 'block' } }} noWrap>
                  {user.email}
                </Typography>

                {/* Role */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <RoleChip role={user.role} />
                </Box>

                {/* Status */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Chip
                    size="small"
                    icon={
                      user.emailConfirmed
                        ? <CheckCircleOutlinedIcon sx={{ fontSize: '13px !important' }} />
                        : <HourglassEmptyOutlinedIcon sx={{ fontSize: '13px !important' }} />
                    }
                    label={user.emailConfirmed ? 'Confirmed' : 'Pending email'}
                    sx={{
                      fontSize: '0.71rem', fontWeight: 600, height: 22,
                      bgcolor: user.emailConfirmed ? alpha('#059669', 0.1) : alpha('#D97706', 0.1),
                      color: user.emailConfirmed ? '#059669' : '#D97706',
                      '& .MuiChip-icon': { color: 'inherit' },
                    }}
                  />
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(user)}
                      sx={{ width: 30, height: 30, color: 'text.secondary', '&:hover': { bgcolor: alpha('#5159D7', 0.1), color: '#5159D7' } }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteTarget(user)}
                      sx={{ width: 30, height: 30, color: 'text.secondary', '&:hover': { bgcolor: alpha('#DC2626', 0.1), color: '#DC2626' } }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}
      <UserDialog
        open={dialogOpen}
        mode={dialogMode}
        user={selectedUser}
        onClose={() => setDialogOpen(false)}
        onSuccess={(msg) => { onNotify(msg); }}
      />
      <DeleteDialog
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={(msg) => { onNotify(msg); }}
      />
    </Paper>
  );
}
