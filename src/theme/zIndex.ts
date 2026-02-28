/**
 * Z-index design tokens for ClarioWeb.
 *
 * Provides a named scale so stacking context stays predictable across the app.
 */

export const zIndex = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
} as const;

export type ZIndexToken = typeof zIndex;
