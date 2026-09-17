import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

import { useLayout } from '../hooks/useLayout';
import AppButton from './AppButton';
import AssetStatusBadge from './AssetStatusBadge';
import { getInitials } from './EmployeeCard';
import type { Employee } from '../types/employee';
import type { Asset } from '../types/asset';

interface EmployeeDetailViewProps {
  employee: Employee;
  assignedAssets: Asset[];
  onBack: () => void;
  onEditProfile: (employee: Employee) => void;
  onAssignAsset: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
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
  const initials = getInitials(employee.name);
  const firstName = employee.name.split(' ')[0];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ── Top Header Navigation Bar ───────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}
          >
            {employee.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {employee.role}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AppButton
            variant="outline"
            size="sm"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ borderColor: 'customColors.borderLight', color: 'text.primary' }}
          >
            Back
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEditProfile(employee)}
            sx={{ borderColor: 'customColors.borderLight', color: 'text.primary' }}
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
          <AppButton
            variant="outline"
            size="icon"
            onClick={() => onDelete?.(employee)}
            sx={{ borderColor: 'rgba(239,68,68,0.4)', color: 'error.main', bgcolor: 'background.paper', '&:hover': { bgcolor: 'rgba(239,68,68,0.06)', borderColor: 'error.main' } }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </AppButton>
        </Box>
      </Box>

      {/* ── Main Content Grid (2 Columns) ─────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr', lg: '350px 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ── Left Card: Profile Summary ─────────────────────────────────── */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2.5,
            borderColor: 'customColors.borderLight',
            bgcolor: 'background.paper',
          }}
        >
          {/* Avatar & Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: employee.avatarBg || 'primary.main',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.4rem',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                flexShrink: 0,
              }}
            >
              {initials}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  fontFamily: '"Manrope", sans-serif',
                  color: 'text.primary',
                }}
              >
                {employee.name}
              </Typography>
              <Typography
                noWrap
                sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 0.75 }}
              >
                {employee.role}
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.25,
                  py: 0.25,
                  borderRadius: '12px',
                  bgcolor: 'customColors.bgNeutral',
                  color: 'text.primary',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                {employee.department}
              </Box>
            </Box>
          </Box>

          {/* Detailed Info List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <MailOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                {employee.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BusinessOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                {employee.department}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                {employee.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                Joined {employee.joinedDate}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ── Right Card: Assigned Assets ──────────────────────────────────── */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            borderColor: 'customColors.borderLight',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          {/* Card Top Header */}
          <Box
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: 'customColors.borderLight',
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: '1rem', fontFamily: '"Manrope", sans-serif' }}
              >
                Assigned assets
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', mt: 0.25 }}>
                {assignedAssets.length} assets in {firstName}'s custody
              </Typography>
            </Box>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => onAssignAsset(employee)}
              sx={{ borderColor: 'customColors.borderLight', color: 'text.primary' }}
            >
              Assign new
            </AppButton>
          </Box>

          {/* Assets Table */}
          {assignedAssets.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'customColors.bgLight' }}>
                    <TableCell
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'text.secondary',
                        letterSpacing: '0.5px',
                        py: 1.5,
                      }}
                    >
                      ASSET
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'text.secondary',
                        letterSpacing: '0.5px',
                        py: 1.5,
                      }}
                    >
                      CATEGORY
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'text.secondary',
                        letterSpacing: '0.5px',
                        py: 1.5,
                      }}
                    >
                      LOCATION
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'text.secondary',
                        letterSpacing: '0.5px',
                        py: 1.5,
                      }}
                    >
                      STATUS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignedAssets.map((asset) => (
                    <TableRow
                      key={asset.id}
                      hover
                      onClick={() => navigateToAsset(asset.id)}
                      sx={{
                        cursor: 'pointer',
                        '&:last-child td, &:last-child th': { border: 0 },
                        borderColor: 'customColors.borderLight',
                        '&:hover': { bgcolor: 'customColors.bgLight' },
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            color: 'primary.main',
                            lineHeight: 1.2,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {asset.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            fontFamily: '"Roboto Mono", monospace',
                            mt: 0.25,
                          }}
                        >
                          {asset.code}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2, fontSize: '0.85rem', color: 'text.secondary' }}>
                        {asset.category}
                      </TableCell>
                      <TableCell sx={{ py: 2, fontSize: '0.85rem', color: 'text.secondary' }}>
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
                p: 5,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'customColors.bgNeutral',
                  color: 'text.secondary',
                }}
              >
                <Inventory2OutlinedIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                No assets currently assigned
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                {employee.name} currently does not have any hardware or equipment in their custody.
              </Typography>
              <AppButton
                variant="default"
                size="sm"
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
