import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { fieldSx, labelSx } from './shared';

const STATUS_OPTIONS = [
  'Available',
  'In Use',
  'Maintenance',
  'Under Maintenance',
  'Retired',
  'Disposed',
];

interface Props {
  state: any;
  setters: any;
  departmentsList: string[];
  locationsList: string[];
  employeesList: { id: string; name: string }[];
}

export default function AssignmentStep({ state, setters, departmentsList, locationsList, employeesList }: Props) {
  const { department, location, assignedEmployee, status } = state;
  const { setDepartment, setLocation, setAssignedEmployee, setStatus } = setters;

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}>
          Assignment
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
          Where this asset lives and who's responsible for it.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <Typography sx={labelSx}>Department</Typography>
          <TextField
            select
            fullWidth
            size="medium"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (selected: unknown) =>
                  !selected || selected === '' ? <span style={{ color: '#94A3B8' }}>Select department</span> : String(selected),
              },
            }}
            sx={fieldSx}
          >
            <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Select department
            </MenuItem>
            {departmentsList.map((d) => (
              <MenuItem key={d} value={d} sx={{ fontSize: '0.9rem' }}>
                {d}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <Typography sx={labelSx}>Location</Typography>
          <TextField
            select
            fullWidth
            size="medium"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (selected: unknown) =>
                  !selected || selected === '' ? <span style={{ color: '#94A3B8' }}>Select location</span> : String(selected),
              },
            }}
            sx={fieldSx}
          >
            <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Select location
            </MenuItem>
            {locationsList.map((l) => (
              <MenuItem key={l} value={l} sx={{ fontSize: '0.9rem' }}>
                {l}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <Typography sx={labelSx}>Assigned employee</Typography>
          <TextField select fullWidth size="medium" value={assignedEmployee} onChange={(e) => setAssignedEmployee(e.target.value)} sx={fieldSx}>
            <MenuItem value="Unassigned" sx={{ fontSize: '0.9rem' }}>
              Unassigned
            </MenuItem>
            {employeesList.map((emp) => (
              <MenuItem key={emp.id} value={emp.name} sx={{ fontSize: '0.9rem' }}>
                {emp.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <Typography sx={labelSx}>Status</Typography>
          <TextField select fullWidth size="medium" value={status} onChange={(e) => setStatus(e.target.value)} sx={fieldSx}>
            {STATUS_OPTIONS.map((st) => (
              <MenuItem key={st} value={st} sx={{ fontSize: '0.9rem' }}>
                {st}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
}
