// ─── User Domain Types ────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'technician' | 'viewer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  /** ISO timestamp of when the user was created in Supabase Auth */
  createdAt?: string;
  /** ISO timestamp of last sign in */
  lastSignIn?: string;
  /** Whether the user's email is confirmed */
  emailConfirmed?: boolean;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  id: string;
  fullName?: string;
  role?: UserRole;
  email?: string;
}
