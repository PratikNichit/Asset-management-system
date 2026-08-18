import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

import AssetStatusBadge from '../AssetStatusBadge';
import type { Asset } from '../../types/asset';

interface AssetSummaryCardProps {
  asset: Asset;
}

export default function AssetSummaryCard({ asset }: AssetSummaryCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
        display: 'flex',
        gap: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      {/* 3D Box Illustration Placeholder */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: 2.5,
          bgcolor: 'customColors.bgLight',
          border: '1px solid',
          borderColor: 'customColors.borderLight',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Inventory2OutlinedIcon sx={{ fontSize: 54, color: 'text.disabled', opacity: 0.6 }} />
      </Box>

      {/* Details Grid */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Pills row: Status & Asset Code */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <AssetStatusBadge status={asset.status} />
          <Box
            sx={{
              px: 1.25,
              py: 0.25,
              borderRadius: '12px',
              bgcolor: 'customColors.bgNeutral',
              color: 'text.primary',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: '"Roboto Mono", monospace',
            }}
          >
            {asset.code}
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: '1.2rem',
            fontFamily: '"Manrope", sans-serif',
            color: 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {asset.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 2, mt: 0.25 }}>
          Apple · A2991
        </Typography>

        {/* 4 Metrics Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'customColors.borderLight',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.5px' }}>
              ASSIGNED TO
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <PersonOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary' }}>
                {asset.assignedTo || 'Unassigned'}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.5px' }}>
              DEPARTMENT
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <BusinessOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary' }}>
                {asset.department}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.5px' }}>
              LOCATION
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary' }}>
                {asset.location}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.5px' }}>
              SERIAL
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <TagOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: 'text.primary',
                  fontFamily: '"Roboto Mono", monospace',
                }}
              >
                {asset.serial}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
