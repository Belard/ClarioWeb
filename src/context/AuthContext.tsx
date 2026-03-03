/**
 * AuthContext — manages authentication state.
 *
 * • Production  → calls the real API via authService (JWT-based).
 * • Development → keeps the existing mock login/signup logic so you can
 *                 work without a running backend.
 *
 * The switch is automatic: Vite sets `import.meta.env.PROD` to `true`
 * when building for production (`npm run build`).
 *
 * Usage:
 *   Wrap your app with <AuthProvider> in App.tsx
 *   Access auth state via useAuth() hook
 */
import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { authService, clearToken } from '@/services';

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'clario_auth_user';
const MOCK_DELAY = 800; // ms

const IS_PROD = import.meta.env.PROD;

// ── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (IS_PROD) {
        // Real API call
        const { user: apiUser } = await authService.login(email, password);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiUser));
        setUser(apiUser);
      } else {
        // Mock — no backend required
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
        const mockUser: User = {
          id: crypto.randomUUID(),
          name: email.split('@')[0],
          email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Signup ───────────────────────────────────────────────────────────────

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      if (IS_PROD) {
        // Real API call
        const { user: apiUser } = await authService.register(name, email, password);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiUser));
        setUser(apiUser);
      } else {
        // Mock — no backend required
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
        const mockUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
