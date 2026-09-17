import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from '@mui/material/styles';

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <FormLabel
      sx={{
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: 'text.primary',
        mb: 0.75,
        letterSpacing: '0.01em',
      }}
    >
      {children}
      {required && (
        <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>
          *
        </Box>
      )}
    </FormLabel>
  );
}

export function SectionCard({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        borderColor: theme.palette.divider,
        mb: 2.5,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          borderColor: theme.palette.mode === 'light' ? 'grey.300' : theme.palette.divider,
        },
      }}
    >
      {children}
    </Paper>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Box sx={{ mb: 2.5, pb: 1.75, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</Typography>
      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}