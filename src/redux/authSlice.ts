import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ─── Async Thunks (Supabase Integrated) ───────────────────────────────────────

/**
 * Sign in with email + password via Supabase.
 * If Supabase is not configured or fails, provides helpful fallback/messaging.
 */
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (!email || !password) throw new Error('Email and password are required.');

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          return {
            id: data.user.id,
            email: data.user.email ?? email.trim(),
            name: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'User',
          } as AuthUser;
        }
      }

      // Local fallback mode when Supabase env vars are not set
      await new Promise((res) => setTimeout(res, 500));
      return {
        id: 'local-user-id',
        email: email.trim(),
        name: email.split('@')[0] || 'User',
      } as AuthUser;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/**
 * Sign out via Supabase.
 */
export const signOut = createAsyncThunk('auth/signOut', async () => {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
});

/**
 * Restore active session on app load from Supabase Auth.
 */
export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      return {
        id: data.session.user.id,
        email: data.session.user.email ?? '',
        name: data.session.user.user_metadata?.full_name ?? data.session.user.email?.split('@')[0] ?? 'User',
      } as AuthUser;
    }
  }
  return null;
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // signIn
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Sign in failed.';
      });

    // signOut
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // restoreSession
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
