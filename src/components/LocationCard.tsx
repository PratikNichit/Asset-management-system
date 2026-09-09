import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import type { LocationItem } from '../types/location';

interface LocationCardProps {
  location: LocationItem;
  onClick?: (location: LocationItem) => void;
}

export default function LocationCard({ location, onClick }: LocationCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const gridLineColor = isDark
    ? 'rgba(99, 102, 241, 0.15)'
    : 'rgba(56, 189, 248, 0.12)';

  return (
    <Paper
      variant="outlined"
      onClick={() => onClick?.(location)}
      sx={{
        borderRadius: 3.5,
        borderColor: theme.palette.customColors.borderLight,
        bgcolor: theme.palette.customColors.white,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
        '&:hover': {
          boxShadow: isDark
            ? '0 10px 28px rgba(0, 0, 0, 0.5)'
            : '0 10px 28px rgba(15, 23, 42, 0.08)',
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-3px)',
        },
      }}
    >
      {/* ── Top Header Banner with Subtle Grid Pattern ─────────────────────── */}
      <Box
        sx={{
          height: 110,
          width: '100%',
          bgcolor: isDark ? 'rgba(99, 102, 241, 0.08)' : '#F3FAF9',
          backgroundImage: `
            linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          p: 2.5,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        {/* Floating Location Name Pill */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.85,
            bgcolor: theme.palette.customColors.white,
            px: 1.75,
            py: 0.75,
            borderRadius: '24px',
            border: '1px solid',
            borderColor: theme.palette.customColors.borderLight,
            boxShadow: isDark
              ? '0 2px 6px rgba(0, 0, 0, 0.3)'
              : '0 2px 6px rgba(15, 23, 42, 0.04)',
          }}
        >
          <PlaceOutlinedIcon sx={{ fontSize: 17, color: theme.palette.primary.main }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.875rem',
              color: 'text.primary',
              fontFamily: '"Manrope", "Inter", sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            {location.name}
          </Typography>
        </Box>
      </Box>

      {/* ── Main Card Body Content ─────────────────────────────────────────── */}
      <Box sx={{ p: 3, pt: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        {/* Location Address */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'text.secondary',
            mb: 2.5,
            fontFamily: '"Manrope", "Inter", sans-serif',
          }}
        >
          {location.address}
        </Typography>

        {/* Bottom Metrics Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
          {/* Assets Metric */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5, color: 'text.secondary' }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 17 }} />
              <Typography sx={{ fontSize: '0.825rem', fontWeight: 500, color: 'inherit' }}>
                Assets
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'text.primary',
                fontFamily: '"Manrope", "Inter", sans-serif',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {location.assetsCount}
            </Typography>
          </Box>

          {/* Employees Metric */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5, color: 'text.secondary' }}>
              <PeopleOutlinedIcon sx={{ fontSize: 17 }} />
              <Typography sx={{ fontSize: '0.825rem', fontWeight: 500, color: 'inherit' }}>
                Employees
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'text.primary',
                fontFamily: '"Manrope", "Inter", sans-serif',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {location.employeesCount}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
