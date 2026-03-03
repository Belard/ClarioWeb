/**
 * Authentication service — calls the real backend API.
 *
 * Only used in production builds. Development builds fall back to mock logic
 * inside AuthContext directly.
 */

import type { AuthResponse } from '@/types';
import { request, setToken } from './api';

// ── Login ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    public: true,
  });

  // Persist JWT for subsequent authenticated requests
  setToken(data.token);
  return data;
}

// ── Register ─────────────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
    public: true,
  });

  setToken(data.token);
  return data;
}
