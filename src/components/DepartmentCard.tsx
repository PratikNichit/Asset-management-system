import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import type { Department } from '../types/department';

interface DepartmentCardProps {
  department: Department;
  onClick?: (department: Department) => void;
}

export default function DepartmentCard({ department, onClick }: DepartmentCardProps) {
  return (
    <Paper
      variant="outlined"
      onClick={() => onClick?.(department)}
      sx={{
        p: 3,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Top Section: Title & Head + Badge */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box sx={{ minWidth: 0, pr: 1 }}>
          <Typography
            noWrap
            sx={{
              fontWeight: 800,
              fontSize: '1.1rem',
              fontFamily: '"Manrope", sans-serif',
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            {department.name}
          </Typography>
          <Typography
            noWrap
            sx={{
              fontSize: '0.83rem',
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            Head: {department.head}
          </Typography>
        </Box>

        {/* 2-Letter Badge Code */}
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: '10px',
            background: department.badgeBg || 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            flexShrink: 0,
          }}
        >
          {department.code}
        </Box>
      </Box>

      {/* Bottom Section: Members & Assets Metrics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          pt: 1,
        }}
      >
        {/* Members Stat */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <PeopleOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 500 }}>
              Members
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: '"Manrope", sans-serif',
              color: 'text.primary',
              lineHeight: 1,
            }}
          >
            {department.membersCount}
          </Typography>
        </Box>

        {/* Assets Stat */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Inventory2OutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 500 }}>
              Assets
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: '"Manrope", sans-serif',
              color: 'text.primary',
              lineHeight: 1,
            }}
          >
            {department.assetsCount}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
