/**
 * Lightweight fetch wrapper for the backend API.
 *
 * In production the requests go to the same origin (nginx proxies /api → :3001).
 * In development this module is NOT used — AuthContext falls back to mock logic.
 */

const TOKEN_KEY = 'clario_auth_token';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── API error class ──────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ── Core request function ────────────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** If true, skip attaching the Authorization header */
  public?: boolean;
}

export async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, public: isPublic = false } = opts;

  const reqHeaders: Record<string, string> = {
    ...headers,
  };

  if (body) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  if (!isPublic) {
    const token = getToken();
    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(path, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON regardless — the API may return an error body
  let data: T | undefined;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    data = (await res.json()) as T;
  }

  if (!res.ok) {
    // Try to extract a human-readable message from common API shapes
    const msg =
      (data as Record<string, unknown> | undefined)?.error ??
      (data as Record<string, unknown> | undefined)?.message ??
      res.statusText;
    throw new ApiError(String(msg), res.status);
  }

  return data as T;
}
