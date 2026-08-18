import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import type { Asset } from '../../types/asset';

interface AssetOverviewTabProps {
  asset: Asset;
}

export default function AssetOverviewTab({ asset }: AssetOverviewTabProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontSize: '0.98rem', fontFamily: '"Manrope", sans-serif', mb: 2.5 }}
      >
        Purchase &amp; warranty
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: 2.5,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 500 }}>
              Purchase date
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'text.primary' }}>
            2024-02-11
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
            <AttachMoneyOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 500 }}>
              Purchase cost
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'text.primary' }}>
            $3,200
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
            <BusinessOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 500 }}>
              Vendor
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'text.primary' }}>
            Apple India
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 500 }}>
              Warranty until
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'text.primary' }}>
            {asset.warrantyExpiry || '2027-02-11'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
