import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import type { LocationItem } from "../types/location";

interface LocationCardProps {
  location: LocationItem;
  onClick?: (location: LocationItem) => void;
  onEdit?: (location: LocationItem) => void;
  onDelete?: (location: LocationItem) => void;
}

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mb: 0.75,
          color: "text.secondary",
        }}
      >
        {icon}
        <Typography
          sx={{ fontSize: "0.8rem", fontWeight: 500, color: "inherit" }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "text.primary",
          fontFamily: '"Manrope", "Inter", sans-serif',
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function LocationCard({
  location,
  onClick,
  onEdit,
  onDelete,
}: LocationCardProps) {
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
    onEdit?.(location);
  };
  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    onDelete?.(location);
  };
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const gridLineColor = isDark
    ? "rgba(99, 102, 241, 0.15)"
    : "rgba(56, 189, 248, 0.12)";

  return (
    <Paper
      variant="outlined"
      onClick={() => onClick?.(location)}
      sx={{
        borderRadius: 3.5,
        borderColor: theme.palette.customColors.borderLight,
        bgcolor: theme.palette.customColors.white,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        boxShadow: isDark
          ? "0 1px 3px rgba(0, 0, 0, 0.4)"
          : "0 1px 3px rgba(0, 0, 0, 0.02)",
        "&:hover": {
          boxShadow: isDark
            ? "0 10px 28px rgba(0, 0, 0, 0.5)"
            : "0 10px 28px rgba(15, 23, 42, 0.08)",
          borderColor: theme.palette.primary.main,
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* ── Banner: grid pattern, name pill (left), menu (right) ───────────── */}
      <Box
        sx={{
          minHeight: 96,
          width: "100%",
          bgcolor: isDark ? "rgba(99, 102, 241, 0.08)" : "#F3FAF9",
          backgroundImage: `
            linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        {/* Name pill: shrinks and wraps for long names */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.85,
            minWidth: 0,
            bgcolor: theme.palette.customColors.white,
            px: 1.75,
            py: 0.75,
            borderRadius: "20px",
            border: "1px solid",
            borderColor: theme.palette.customColors.borderLight,
            boxShadow: isDark
              ? "0 2px 6px rgba(0, 0, 0, 0.3)"
              : "0 2px 6px rgba(15, 23, 42, 0.04)",
          }}
        >
          <PlaceOutlinedIcon
            sx={{
              fontSize: 17,
              color: theme.palette.primary.main,
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              lineHeight: 1.3,
              color: "text.primary",
              fontFamily: '"Manrope", "Inter", sans-serif',
              letterSpacing: "-0.01em",
              overflowWrap: "anywhere",
            }}
          >
            {location.name}
          </Typography>
        </Box>

        {/* Menu button sits on a small white chip so it stays readable over the grid */}
        <IconButton
          size="small"
          aria-label={`Actions for ${location.name}`}
          onClick={handleMenuClick}
          sx={{
            flexShrink: 0,
            color: "text.secondary",
            bgcolor: theme.palette.customColors.white,
            border: "1px solid",
            borderColor: theme.palette.customColors.borderLight,
            "&:hover": {
              color: "text.primary",
              bgcolor: theme.palette.customColors.white,
            },
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

      {/* ── Body: address + metrics ────────────────────────────────────────── */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 2.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.92rem",
            lineHeight: 1.55,
            color: "text.secondary",
            fontFamily: '"Manrope", "Inter", sans-serif',
            overflowWrap: "anywhere",
          }}
        >
          {location.address}
        </Typography>

        {/* Metrics panel, pinned to the bottom so cards line up across a row */}
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
          <Metric
            icon={<Inventory2OutlinedIcon sx={{ fontSize: 17 }} />}
            label="Assets"
            value={location.assetsCount}
          />
          <Box sx={{ width: "1px", bgcolor: "divider", flexShrink: 0 }} />
          <Metric
            icon={<PeopleOutlinedIcon sx={{ fontSize: 17 }} />}
            label="Employees"
            value={location.employeesCount}
          />
        </Box>
      </Box>
    </Paper>
  );
}
