import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import type { AssetCategoryItem, CategoryIconType } from '../types/category';

interface CategoryCardProps {
  category: AssetCategoryItem;
  onClick?: (category: AssetCategoryItem) => void;
}

function renderCategoryIcon(iconType: CategoryIconType, color: string) {
  const sx = { fontSize: 24, color };
  switch (iconType) {
    case 'laptop':
      return <LaptopMacOutlinedIcon sx={sx} />;
    case 'monitor':
      return <DesktopWindowsOutlinedIcon sx={sx} />;
    case 'machine':
      return <SettingsOutlinedIcon sx={sx} />;
    case 'mold':
      return <CategoryOutlinedIcon sx={sx} />;
    case 'forklift':
      return <LocalShippingOutlinedIcon sx={sx} />;
    case 'peripheral':
      return <MouseOutlinedIcon sx={sx} />;
    case 'furniture':
      return <ChairOutlinedIcon sx={sx} />;
    case 'software':
      return <VpnKeyOutlinedIcon sx={sx} />;
    default:
      return <CategoryOutlinedIcon sx={sx} />;
  }
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <Paper
      variant="outlined"
      onClick={() => onClick?.(category)}
      sx={{
        p: 3,
        borderRadius: 2.5,
        borderColor: 'customColors.borderLight',
        bgcolor: 'background.paper',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Icon Badge */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          bgcolor: category.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {renderCategoryIcon(category.iconType, category.iconColor)}
      </Box>

      {/* Category Name & Assets Count */}
      <Box>
        <Typography
          noWrap
          sx={{
            fontWeight: 800,
            fontSize: '1.15rem',
            fontFamily: '"Manrope", sans-serif',
            color: 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {category.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.85rem',
            color: 'text.secondary',
            mt: 0.5,
            fontWeight: 500,
          }}
        >
          {category.assetsCount} assets
        </Typography>
      </Box>
    </Paper>
  );
}
