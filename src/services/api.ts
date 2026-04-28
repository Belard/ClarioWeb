/**
 * Lightweight fetch wrapper for the backend API.
 *
 * In production the requests go to the same origin (nginx proxies /api → :3001).
 * In development this module is NOT used — AuthContext falls back to mock logic.
 */

const TOKEN_KEY = 'clario_auth_token';
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;

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

export class ApiTimeoutError extends Error {
  constructor(message = 'Request timed out.') {
    super(message);
    this.name = 'ApiTimeoutError';
  }
}

// ── Core request function ────────────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** If true, skip attaching the Authorization header */
  public?: boolean;
  timeoutMs?: number;
}

export async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    public: isPublic = false,
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
  } = opts;

  const reqHeaders: Record<string, string> = {
    ...headers,
  };

  const isFormData = body instanceof FormData;

  if (body && !isFormData) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  if (!isPublic) {
    const token = getToken();
    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => {
    abortController.abort();
  }, timeoutMs);

  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers: reqHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      signal: abortController.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiTimeoutError();
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

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
