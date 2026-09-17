import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
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
  onEdit?: (category: AssetCategoryItem) => void;
  onDelete?: (category: AssetCategoryItem) => void;
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

export default function CategoryCard({ category, onClick, onEdit, onDelete }: CategoryCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    onEdit?.(category);
  };
  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    onDelete?.(category);
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'background.paper',
              px: 1.5,
              py: 0.5,
              borderRadius: '24px',
              border: '1px solid',
              borderColor: 'customColors.borderLight',
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
              {category.assetsCount}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'text.primary', bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { borderRadius: 2, mt: 0.5, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 140 }
            }}
          >
            <MenuItem onClick={handleEdit} sx={{ fontSize: '0.875rem', gap: 1.5, py: 1 }}>
              <EditOutlinedIcon fontSize="small" color="action" />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ fontSize: '0.875rem', gap: 1.5, py: 1, color: 'error.main' }}>
              <DeleteOutlinedIcon fontSize="small" color="error" />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
}
