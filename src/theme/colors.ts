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
    50:  '#e6eaeb',
    100: '#ced5d6',
    150: '#b5c1c2',
    200: '#90acad',
    300: '#688284',
    400: '#3a595b',
    500: '#092f32', // default
    600: '#072628',
    700: '#051c1e',
    800: '#041314',
    850: '#030e0f',
    900: '#02080a',
    950: '#010505',
  },

  // ── Secondary / accent color ─────────────────────────────────────────────
  secondary: {
    50:  '#fdfcf6',
    100: '#fbf9ec',
    150: '#faf6e3',
    200: '#f8f3da',
    300: '#f4edc7',
    400: '#f1e7b5',
    500: '#ede1a2', // default
    600: '#b8b482',
    700: '#8b8761',
    800: '#5f5a41',
    850: '#474431',
    900: '#2f2d20',
    950: '#181710',
  },

  // ── Neutral / gray scale ─────────────────────────────────────────────────
  neutral: {
    0:   '#ffffff', // White
    10:  '#fcfcfe',
    20:  '#f7f9fb',
    30:  '#f0f2f7',
    40:  '#e8ecf3',
    50:  '#e1e5ef',
    60:  '#d9dfeb',
    70:  '#a3a7B0',
    80:  '#6D7076',
    90:  '#36383B',
    100: '#000000', // Black
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
