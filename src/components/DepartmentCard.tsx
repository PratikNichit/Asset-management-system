import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import type { Department } from "../types/department";

interface DepartmentCardProps {
  department: Department;
  onClick?: (department: Department) => void;
  onEdit?: (department: Department) => void;
  onDelete?: (department: Department) => void;
}

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
        {icon}
        <Typography
          sx={{ fontSize: "0.78rem", color: "text.secondary", fontWeight: 500 }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: "1.4rem",
          fontWeight: 800,
          fontFamily: '"Manrope", sans-serif',
          color: "text.primary",
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function DepartmentCard({
  department,
  onClick,
  onEdit,
  onDelete,
}: DepartmentCardProps) {
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
    onEdit?.(department);
  };
  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    onDelete?.(department);
  };

  return (
    <Paper
      variant="outlined"
      onClick={() => onClick?.(department)}
      sx={{
        p: 3,
        borderRadius: 2.5,
        borderColor: "customColors.borderLight",
        bgcolor: "background.paper",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Top row: code badge (left) + actions menu (right) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            minWidth: 44,
            height: 44,
            px: 1,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              department.badgeBg ||
              "linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "0.85rem",
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}
        >
          {department.code}
        </Box>

        <IconButton
          size="small"
          aria-label={`Actions for ${department.name}`}
          onClick={handleMenuClick}
          sx={{
            mt: -0.5,
            mr: -0.75,
            color: "text.secondary",
            "&:hover": { color: "text.primary", bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 2,
                mt: 0.5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                minWidth: 140,
              },
            },
          }}
        >
          <MenuItem
            onClick={handleEdit}
            sx={{ fontSize: "0.875rem", gap: 1.5, py: 1 }}
          >
            <EditOutlinedIcon fontSize="small" color="action" />
            Edit
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{ fontSize: "0.875rem", gap: 1.5, py: 1, color: "error.main" }}
          >
            <DeleteOutlinedIcon fontSize="small" color="error" />
            Delete
          </MenuItem>
        </Menu>
      </Box>

      {/* Name + head (both wrap instead of truncating) */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.15rem",
            fontFamily: '"Manrope", sans-serif',
            color: "text.primary",
            lineHeight: 1.3,
            overflowWrap: "anywhere",
          }}
        >
          {department.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "text.secondary",
            mt: 0.5,
            overflowWrap: "anywhere",
          }}
        >
          Head: {department.head}
        </Typography>
      </Box>

      {/* Stats panel, pinned to the bottom so cards of different heights line up */}
      <Box
        sx={{
          mt: "auto",
          display: "flex",
          alignItems: "stretch",
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: "action.hover",
        }}
      >
        <Stat
          icon={
            <PeopleOutlinedIcon
              sx={{ fontSize: 16, color: "text.secondary" }}
            />
          }
          label="Members"
          value={department.membersCount}
        />
        <Box sx={{ width: "1px", bgcolor: "divider", flexShrink: 0 }} />
        <Stat
          icon={
            <Inventory2OutlinedIcon
              sx={{ fontSize: 16, color: "text.secondary" }}
            />
          }
          label="Assets"
          value={department.assetsCount}
        />
      </Box>
    </Paper>
  );
}
