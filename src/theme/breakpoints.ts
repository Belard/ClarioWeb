/**
 * Responsive breakpoint design tokens for ClarioWeb.
 *
 * Usage:
 *   import { breakpoints } from './breakpoints';
 *   // CSS-in-JS: `@media (min-width: ${breakpoints.md})`
 */

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/** Helper: returns a min-width media query string for the given breakpoint. */
export const mediaQuery = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;

export type BreakpointToken = typeof breakpoints;
