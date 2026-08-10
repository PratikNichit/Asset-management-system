import { useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUsers, setLoading, selectAllUsers, selectUsersLoading } from './redux/usersSlice';
import AppButton from './components/AppButton';

function App() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    // Simulate fetching users
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setUsers([
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ]));
      dispatch(setLoading(false));
    }, 1000);
  }, [dispatch]);

  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" color="primary" gutterBottom>
        Asset Management System
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        React + Vite + TS + MUI + Redux Boilerplate
      </Typography>

      <Stack spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
        <AppButton loading={loading} onClick={() => console.log('Action clicked!')}>
          Primary Action
        </AppButton>
        <AppButton variant="outlined" color="secondary">
          Secondary Action
        </AppButton>
      </Stack>

      <Box sx={{ mt: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>User List (Redux State)</Typography>
        {loading ? (
          <Typography>Loading users...</Typography>
        ) : (
          users.map(user => (
            <Box key={user.id} sx={{ p: 2, mb: 1, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body1">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default App;
