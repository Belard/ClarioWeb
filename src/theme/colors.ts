/**
 * Color design tokens for ClarioWeb.
 *
 * Each palette entry follows the scale:
 *   50 (lightest) → 900 (darkest)
 *
 * Usage:
 *   import { colors } from './colors';
 *   const bg = colors.primary[500];
 */

export const colors = {
  // ── Primary brand color ──────────────────────────────────────────────────
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // default
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // ── Secondary / accent color ─────────────────────────────────────────────
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // default
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // ── Neutral / gray scale ─────────────────────────────────────────────────
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // ── Semantic colors ──────────────────────────────────────────────────────
  success: {
    light: '#d1fae5',
    default: '#10b981',
    dark: '#065f46',
  },
  warning: {
    light: '#fef3c7',
    default: '#f59e0b',
    dark: '#92400e',
  },
  error: {
    light: '#fee2e2',
    default: '#ef4444',
    dark: '#991b1b',
  },
  info: {
    light: '#dbeafe',
    default: '#3b82f6',
    dark: '#1e3a8a',
  },

  // ── Base ─────────────────────────────────────────────────────────────────
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = typeof colors;
