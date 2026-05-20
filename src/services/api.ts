/**
 * Lightweight fetch wrapper for the backend API.
 *
 * In production the requests go to the same origin (nginx proxies /api → :3001).
 * In development this module is NOT used — AuthContext falls back to mock logic.
 */

const TOKEN_KEY = 'clario_auth_token';
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;

type UnauthorizedHandler = () => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let unauthorizedInFlight: Promise<void> | null = null;

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

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const payloadBase64Url = parts[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = payloadBase64.length % 4;
    const normalizedPayload =
      padding === 0 ? payloadBase64 : payloadBase64 + '='.repeat(4 - padding);
    const decodedPayload = atob(normalizedPayload);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return true;
  }

  const exp = payload['exp'];
  if (typeof exp !== 'number') {
    return true;
  }

  return exp * 1000 <= Date.now();
}

async function triggerUnauthorized(): Promise<void> {
  if (!unauthorizedHandler) {
    return;
  }

  if (!unauthorizedInFlight) {
    unauthorizedInFlight = Promise.resolve()
      .then(() => unauthorizedHandler?.())
      .catch(() => undefined)
      .finally(() => {
        unauthorizedInFlight = null;
      });
  }

  await unauthorizedInFlight;
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
      if (isTokenExpired(token)) {
        clearToken();
        await triggerUnauthorized();
        throw new ApiError('Session expired.', 401);
      }

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
    const error = new ApiError(String(msg), res.status);

    if (error.status === 401 && !isPublic) {
      clearToken();
      await triggerUnauthorized();
    }

    throw error;
  }

  return data as T;
}
