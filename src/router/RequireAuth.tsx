import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '../app/hooks';
import { selectAuthStatus } from '../redux/authSlice';

/**
 * RequireAuth — single route guard powered by the three-state auth status.
 *
 * Flow on every protected route:
 *   status === 'loading'         → full-page spinner (Supabase has not resolved yet)
 *   status === 'unauthenticated' → redirect to /login, saving current location so
 *                                  LoginWrapper can bring the user back afterwards
 *   status === 'authenticated'   → render children via <Outlet />
 *
 * Because this renders NOTHING for the child route until auth is confirmed,
 * page-level useEffect hooks that dispatch fetch thunks never fire for
 * unauthenticated visitors — eliminating all 401s from unguarded fetches.
 */
export default function RequireAuth() {
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'loading') {
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

  if (status === 'unauthenticated') {
    // Preserve the path the user tried to visit so LoginWrapper can
    // redirect back to it after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
