import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { useLayout } from "../hooks/useLayout";
import AppButton from "./AppButton";
import AssetStatusBadge from "./AssetStatusBadge";
import { getInitials } from "./EmployeeCard";
import type { Employee } from "../types/employee";
import type { Asset } from "../types/asset";

interface EmployeeDetailViewProps {
  employee: Employee;
  assignedAssets: Asset[];
  onBack: () => void;
  onEditProfile: (employee: Employee) => void;
  onAssignAsset: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

const HEADING_FONT = '"Manrope", sans-serif';

const outlineButtonSx: SxProps<Theme> = {
  borderColor: "customColors.borderLight",
  color: "text.primary",
};

const dangerButtonSx: SxProps<Theme> = {
  color: "error.main",
  bgcolor: "background.paper",
  borderColor: (theme) => alpha(theme.palette.error.main, 0.4),
  "&:hover": {
    bgcolor: (theme) => alpha(theme.palette.error.main, 0.06),
    borderColor: "error.main",
  },
};

const cardSx: SxProps<Theme> = {
  borderRadius: 2.5,
  borderColor: "customColors.borderLight",
  bgcolor: "background.paper",
  overflow: "hidden",
};

const cardHeaderSx: SxProps<Theme> = {
  px: 2.5,
  py: 2,
  borderBottom: "1px solid",
  borderColor: "customColors.borderLight",
};

const headCellSx: SxProps<Theme> = {
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "text.secondary",
  py: 1.5,
};

const columns = [
  { label: "Asset", align: "left" },
  { label: "Category", align: "left" },
  { label: "Location", align: "left" },
  { label: "Status", align: "right" },
] as const;

function DetailRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <Box sx={{ display: "flex", color: "text.secondary", flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: "text.primary",
          wordBreak: "break-word",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export default function EmployeeDetailView({
  employee,
  assignedAssets,
  onBack,
  onEditProfile,
  onAssignAsset,
  onDelete,
}: EmployeeDetailViewProps) {
  const { navigateToAsset } = useLayout();
  const firstName = employee.name.split(" ")[0];
  const assetCount = assignedAssets.length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ── Header: identity on the left, actions on the right ─────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}
        >
          <AppButton
            variant="outline"
            size="icon"
            onClick={onBack}
            aria-label="Back to employees"
            sx={outlineButtonSx}
          >
            <ArrowBackIcon fontSize="small" />
          </AppButton>

          <Box
            aria-hidden
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              bgcolor: employee.avatarBg || "primary.main",
              color: "common.white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.2rem",
              fontFamily: HEADING_FONT,
              flexShrink: 0,
            }}
          >
            {getInitials(employee.name)}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              component="h1"
              noWrap
              sx={{
                fontWeight: 800,
                fontFamily: HEADING_FONT,
                color: "text.primary",
                lineHeight: 1.25,
              }}
            >
              {employee.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {employee.role}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <AppButton
            variant="outline"
            size="sm"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEditProfile(employee)}
            sx={outlineButtonSx}
          >
            Edit profile
          </AppButton>
          <AppButton
            variant="default"
            size="sm"
            startIcon={<PersonAddAlt1OutlinedIcon />}
            onClick={() => onAssignAsset(employee)}
          >
            Assign asset
          </AppButton>
          {onDelete && (
            <AppButton
              variant="outline"
              size="icon"
              onClick={() => onDelete(employee)}
              aria-label={`Delete ${employee.name}`}
              sx={dangerButtonSx}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </AppButton>
          )}
        </Box>
      </Box>

      {/* ── Two-column body ───────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr", lg: "340px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left: details */}
        <Paper variant="outlined" sx={cardSx}>
          <Box sx={cardHeaderSx}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                fontFamily: HEADING_FONT,
              }}
            >
              Details
            </Typography>
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2.5 }}
          >
            <DetailRow icon={<MailOutlinedIcon sx={{ fontSize: 18 }} />}>
              <Link
                href={`mailto:${employee.email}`}
                underline="hover"
                color="inherit"
              >
                {employee.email}
              </Link>
            </DetailRow>
            <DetailRow icon={<BusinessOutlinedIcon sx={{ fontSize: 18 }} />}>
              {employee.department}
            </DetailRow>
            <DetailRow icon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />}>
              {employee.location}
            </DetailRow>
            <DetailRow
              icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />}
            >
              Joined {employee.joinedDate}
            </DetailRow>
          </Box>
        </Paper>

        {/* Right: assigned assets */}
        <Paper variant="outlined" sx={cardSx}>
          <Box sx={cardHeaderSx}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                fontFamily: HEADING_FONT,
              }}
            >
              Assigned assets
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.82rem", mt: 0.25 }}
            >
              {assetCount} {assetCount === 1 ? "asset" : "assets"} in{" "}
              {firstName}&apos;s custody
            </Typography>
          </Box>

          {assetCount > 0 ? (
            <TableContainer>
              <Table
                sx={{
                  minWidth: 500,
                  "& .MuiTableCell-root": {
                    borderColor: "customColors.borderLight",
                  },
                }}
              >
                <TableHead>
                  <TableRow sx={{ bgcolor: "customColors.bgLight" }}>
                    {columns.map((col) => (
                      <TableCell
                        key={col.label}
                        align={col.align}
                        sx={headCellSx}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignedAssets.map((asset) => (
                    <TableRow
                      key={asset.id}
                      hover
                      tabIndex={0}
                      onClick={() => navigateToAsset(asset.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigateToAsset(asset.id);
                        }
                      }}
                      sx={{
                        cursor: "pointer",
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { bgcolor: "customColors.bgLight" },
                        "&:hover .asset-name": { textDecoration: "underline" },
                        "&:focus-visible": {
                          outline: "2px solid",
                          outlineColor: "primary.main",
                          outlineOffset: "-2px",
                        },
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Typography
                          className="asset-name"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            color: "primary.main",
                            lineHeight: 1.2,
                          }}
                        >
                          {asset.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            fontFamily: '"Roboto Mono", monospace',
                            mt: 0.25,
                          }}
                        >
                          {asset.code}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2,
                          fontSize: "0.85rem",
                          color: "text.secondary",
                        }}
                      >
                        {asset.category}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2,
                          fontSize: "0.85rem",
                          color: "text.secondary",
                        }}
                      >
                        {asset.location}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <AssetStatusBadge status={asset.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                py: 6,
                px: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.25,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  p: 1.75,
                  borderRadius: "50%",
                  bgcolor: "customColors.bgNeutral",
                  color: "text.secondary",
                }}
              >
                <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                No assets assigned
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 340 }}
              >
                {employee.name} doesn&apos;t have any equipment yet. Assign a
                laptop, phone or other asset from inventory.
              </Typography>
              <AppButton
                variant="default"
                size="sm"
                startIcon={<PersonAddAlt1OutlinedIcon />}
                onClick={() => onAssignAsset(employee)}
                sx={{ mt: 1 }}
              >
                Assign asset to {firstName}
              </AppButton>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
