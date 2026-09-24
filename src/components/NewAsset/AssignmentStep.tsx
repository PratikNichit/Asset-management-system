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
  handlers: any;
  departmentsList: { id: string; name: string }[];
  locationsList: { id: string; name: string }[];
  employeesList: { id: string; name: string }[];
}

export default function AssignmentStep({ state, setters, handlers, departmentsList, locationsList, employeesList }: Props) {
  const { department, location, assignedEmployee, status } = state;
  const { setDepartment, setLocation, setAssignedEmployee, setStatus } = setters;
  const { showError } = handlers;

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
            onBlur={() => setters.setTouched((t: any) => ({ ...t, department: true }))}
            error={Boolean(showError(2, 'department'))}
            helperText={showError(2, 'department') || ' '}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (selected: unknown) => {
                  if (!selected || selected === '') return <span style={{ color: '#94A3B8' }}>Select department</span>;
                  const found = departmentsList.find(d => d.id === selected);
                  return found ? found.name : String(selected);
                }
              },
            }}
            sx={fieldSx}
          >
            <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Select department
            </MenuItem>
            {departmentsList.map((d) => (
              <MenuItem key={d.id} value={d.id} sx={{ fontSize: '0.9rem' }}>
                {d.name}
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
            onBlur={() => setters.setTouched((t: any) => ({ ...t, location: true }))}
            error={Boolean(showError(2, 'location'))}
            helperText={showError(2, 'location') || ' '}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (selected: unknown) => {
                  if (!selected || selected === '') return <span style={{ color: '#94A3B8' }}>Select location</span>;
                  const found = locationsList.find(l => l.id === selected);
                  return found ? found.name : String(selected);
                }
              },
            }}
            sx={fieldSx}
          >
            <MenuItem value="" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Select location
            </MenuItem>
            {locationsList.map((l) => (
              <MenuItem key={l.id} value={l.id} sx={{ fontSize: '0.9rem' }}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <Typography sx={labelSx}>Assigned employee</Typography>
          <TextField select fullWidth size="medium" value={assignedEmployee} onChange={(e) => setAssignedEmployee(e.target.value)} sx={fieldSx} slotProps={{ select: { renderValue: (selected: unknown) => { if (selected === 'Unassigned') return 'Unassigned'; const found = employeesList.find(e => e.id === selected); return found ? found.name : String(selected); } } }}>
            <MenuItem value="Unassigned" sx={{ fontSize: '0.9rem' }}>
              Unassigned
            </MenuItem>
            {employeesList.map((emp) => (
              <MenuItem key={emp.id} value={emp.id} sx={{ fontSize: '0.9rem' }}>
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
