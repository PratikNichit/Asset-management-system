import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import type { Employee } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  assetCount: number;
  onClick: (employee: Employee) => void;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function EmployeeCard({ employee, assetCount, onClick }: EmployeeCardProps) {
  const initials = getInitials(employee.name);

  return (
    <Paper
      variant="outlined"
      onClick={() => onClick(employee)}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Top Header: Avatar + Name + Role */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            bgcolor: employee.avatarBg || 'primary.main',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.5px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {initials}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'text.primary',
              fontFamily: '"Manrope", sans-serif',
              lineHeight: 1.2,
            }}
          >
            {employee.name}
          </Typography>
          <Typography
            noWrap
            sx={{
              fontSize: '0.82rem',
              color: 'text.secondary',
              mt: 0.25,
            }}
          >
            {employee.role}
          </Typography>
        </Box>
      </Box>

      {/* Middle: Email */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <MailOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.8 }} />
        <Typography
          noWrap
          sx={{
            fontSize: '0.82rem',
            color: 'text.secondary',
            fontFamily: 'inherit',
          }}
        >
          {employee.email}
        </Typography>
      </Box>

      {/* Bottom Footer: Dept Pill + Asset Count */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 'auto',
          pt: 0.5,
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.4,
            borderRadius: '12px',
            bgcolor: 'customColors.bgNeutral',
            color: 'text.primary',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {employee.department}
        </Box>
        <Typography
          sx={{
            fontSize: '0.82rem',
            color: 'text.primary',
            fontWeight: 700,
          }}
        >
          {assetCount} <span style={{ fontWeight: 400, color: '#6B7280' }}>assets</span>
        </Typography>
      </Box>
    </Paper>
  );
}
