import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '../redux/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * ProtectedRoute — wraps any routes that require authentication.
 *
 * - While session is being restored (isLoading), renders a centered spinner.
 * - If unauthenticated, redirects to /login (replaces history entry so back button
 *   doesn't send users back to the protected page).
 * - If authenticated, renders the child routes via <Outlet />.
 *
 * In Phase 2, this checks the real Supabase session via the authSlice restoreSession thunk.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
