import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { User } from '../types/user';

interface UsersState {
  list: User[];
  loading: boolean;
}

const initialState: UsersState = { list: [], loading: false };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  },
});

export const { setUsers, setLoading } = usersSlice.actions;
export const selectAllUsers = (state: RootState) => state.users.list;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export default usersSlice.reducer;
