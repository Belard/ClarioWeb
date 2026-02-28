/**
 * Theme — unified design token export for ClarioWeb.
 *
 * Import the whole theme object:
 *   import { theme } from '@/theme';
 *
 * Or import individual token groups:
 *   import { colors, typography, spacing } from '@/theme';
 */

export { colors } from './colors';
export type { ColorToken } from './colors';

export { typography } from './typography';
export type { TypographyToken } from './typography';

export { spacing } from './spacing';
export type { SpacingToken } from './spacing';

export { breakpoints, mediaQuery } from './breakpoints';
export type { BreakpointToken } from './breakpoints';

export { shadows } from './shadows';
export type { ShadowToken } from './shadows';

export { borderRadius } from './borderRadius';
export type { BorderRadiusToken } from './borderRadius';

export { zIndex } from './zIndex';
export type { ZIndexToken } from './zIndex';

// ── Combined theme object ────────────────────────────────────────────────────
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { breakpoints, mediaQuery } from './breakpoints';
import { shadows } from './shadows';
import { borderRadius } from './borderRadius';
import { zIndex } from './zIndex';

export const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  mediaQuery,
  shadows,
  borderRadius,
  zIndex,
} as const;

export type Theme = typeof theme;
