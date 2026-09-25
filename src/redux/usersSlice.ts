import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types/user';
import { supabase, supabaseAdmin, isAdminConfigured, isSupabaseConfigured } from '../lib/supabase';

// ─── State ────────────────────────────────────────────────────────────────────

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = { list: [], loading: false, error: null };

// ─── Helper ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseUser(raw: any): User {
  return {
    id: raw.id,
    email: raw.email ?? '',
    fullName:
      raw.user_metadata?.full_name ??
      raw.user_metadata?.name ??
      raw.email?.split('@')[0] ??
      'Unnamed',
    role: raw.user_metadata?.role ?? 'viewer',
    createdAt: raw.created_at,
    lastSignIn: raw.last_sign_in_at,
    emailConfirmed: Boolean(raw.email_confirmed_at),
  };
}

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/**
 * Fetch all users from Supabase Auth using the admin API.
 * Requires VITE_SUPABASE_SERVICE_ROLE_KEY.
 * Falls back to the currently signed-in user if admin is not configured.
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Admin path — list all users
      if (isAdminConfigured() && supabaseAdmin) {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        if (error) throw error;
        return (data?.users ?? []).map(mapSupabaseUser);
      }

      // Fallback — return only the currently signed-in user
      if (isSupabaseConfigured()) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) return [mapSupabaseUser(data.user)];
      }

      return [] as User[];
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/**
 * Create a new user via supabase.auth.signUp().
 *
 * This uses the **anon/publishable key** — safe to call from the browser.
 * The user's full name and role are stored in options.data (user_metadata).
 *
 * Note: if your Supabase project requires email confirmation, the new user
 * will receive a confirmation email and cannot log in until confirmed.
 * Set "Confirm email" OFF in Auth > Settings for instant access.
 */
export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: payload.email.trim(),
        password: payload.password,
        options: {
          data: {
            full_name: payload.fullName.trim(),
            role: payload.role,
          },
        },
      });

      if (error) throw error;

      // Supabase returns null user when email confirmation is required
      // and the email is already registered.
      if (!data?.user) {
        throw new Error(
          'Sign-up returned no user. The email may already be registered, or email confirmation is required — check your inbox.'
        );
      }

      return mapSupabaseUser(data.user);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/**
 * Update a user's metadata (full name, role) via Supabase Auth admin API.
 * Requires VITE_SUPABASE_SERVICE_ROLE_KEY — a user can only update their
 * own metadata via the regular client.
 */
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (payload: UpdateUserPayload, { getState, rejectWithValue }) => {
    try {
      const existing = (getState() as RootState).users.list.find(
        (u) => u.id === payload.id
      );

      // If editing the currently-signed-in user, use the regular client
      const { data: sessionData } = await supabase.auth.getUser();
      const isSelf = sessionData?.user?.id === payload.id;

      if (isSelf) {
        const { data, error } = await supabase.auth.updateUser({
          ...(payload.email ? { email: payload.email.trim() } : {}),
          data: {
            full_name: payload.fullName ?? existing?.fullName ?? '',
            role: payload.role ?? existing?.role ?? 'viewer',
          },
        });
        if (error) throw error;
        if (!data?.user) throw new Error('Update returned no data.');
        return mapSupabaseUser(data.user);
      }

      // Admin path for updating other users
      if (!isAdminConfigured() || !supabaseAdmin) {
        throw new Error(
          'Updating other users requires the service-role key. Add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env file, or have each user update their own profile.'
        );
      }

      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        payload.id,
        {
          ...(payload.email ? { email: payload.email.trim() } : {}),
          user_metadata: {
            full_name: payload.fullName ?? existing?.fullName ?? '',
            role: payload.role ?? existing?.role ?? 'viewer',
          },
        }
      );

      if (error) throw error;
      if (!data?.user) throw new Error('Update returned no data.');
      return mapSupabaseUser(data.user);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/**
 * Delete a user from Supabase Auth via admin API.
 * Requires VITE_SUPABASE_SERVICE_ROLE_KEY.
 */
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      if (!isAdminConfigured() || !supabaseAdmin) {
        throw new Error(
          'Deleting users requires the service-role key. Add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env file.'
        );
      }

      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;

      return userId;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

    // createUser
    builder
      .addCase(createUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createUser.fulfilled, (state, action) => { state.loading = false; state.list.unshift(action.payload); })
      .addCase(createUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

    // updateUser
    builder
      .addCase(updateUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

    // deleteUser
    builder
      .addCase(deleteUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteUser.fulfilled, (state, action) => { state.loading = false; state.list = state.list.filter((u) => u.id !== action.payload); })
      .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { setUsers, setLoading, clearUsersError } = usersSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllUsers = (state: RootState) => state.users.list;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;

export default usersSlice.reducer;
