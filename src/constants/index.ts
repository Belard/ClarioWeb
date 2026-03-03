/**
 * App-wide constants — barrel export.
 */

export const APP_NAME = 'Clario';
export const APP_VERSION = '0.0';

/**
 * Base URL for the backend API.
 * In production the frontend is served by nginx on the same origin,
 * which proxies /api/* requests to the Go backend on port 3001 —
 * so requests use a relative path and this constant is not needed.
 * Kept here for reference / potential dev-proxy use.
 */
export const API_BASE_URL = 'https://clario.pt';
