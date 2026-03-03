/**
 * App-wide TypeScript type definitions — barrel export.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Shape returned by POST /api/auth/login and POST /api/auth/register */
export interface AuthResponse {
  token: string;
  user: User;
}
