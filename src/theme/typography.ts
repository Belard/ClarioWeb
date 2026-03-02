/**
 * Typography design tokens for ClarioWeb.
 *
 * Based on Inter typeface with a Major Second scale (×1.125, base 16 px).
 * Semantic type styles: Display, Heading, Body, Link, Label.
 */

export const typography = {
  // ── Font families ────────────────────────────────────────────────────────
  fontFamily: {
    sans:         ['General Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    generalSans:  ['General Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    inter:        ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },

  // ── Font sizes — Major Second scale from 16 px ───────────────────────────
  fontSize: {
    // Label
    label:   '0.75rem',    // 12 px
    // Body / Link
    sm:      '0.875rem',   // 14 px
    md:      '1rem',       // 16 px
    lg:      '1.125rem',   // 18 px
    // Heading
    xl:      '1.25rem',    // 20 px  — Heading / Small
    '2xl':   '1.5rem',     // 24 px  — Heading / Medium
    '3xl':   '1.875rem',   // 30 px  — Heading / Large
    '4xl':   '2.25rem',    // 36 px  — Heading / X-Large
    // Display
    '5xl':   '3rem',       // 48 px  — Display / Small
    '6xl':   '3.75rem',    // 60 px  — Display / Medium
    '7xl':   '4.5rem',     // 72 px  — Display / Large
  },

  // ── Font weights ─────────────────────────────────────────────────────────
  fontWeight: {
    normal:   400,
    semibold: 600,
    bold:     700,
  },

  // ── Line heights ─────────────────────────────────────────────────────────
  lineHeight: {
    tight:  1.25,
    snug:   1.375,
    normal: 1.5,
  },

  // ── Letter spacing ───────────────────────────────────────────────────────
  letterSpacing: {
    normal:  '0em',
    wide:    '0.05em',   // used for Label (uppercase)
    tight:   '-0.025em', // used for Display
  },

  // ── Semantic type styles ─────────────────────────────────────────────────
  typeStyles: {
    // Display
    displayLarge:  { fontSize: '4.5rem',   fontWeight: 700, lineHeight: 1.25,  letterSpacing: '-0.025em' },
    displayMedium: { fontSize: '3.75rem',  fontWeight: 700, lineHeight: 1.25,  letterSpacing: '-0.025em' },
    displaySmall:  { fontSize: '3rem',     fontWeight: 700, lineHeight: 1.25,  letterSpacing: '-0.025em' },

    // Heading
    headingXL:         { fontSize: '2.25rem',  fontWeight: 400, lineHeight: 1.375 },
    headingXLSemiBold: { fontSize: '2.25rem',  fontWeight: 600, lineHeight: 1.375 },
    headingL:          { fontSize: '1.875rem', fontWeight: 400, lineHeight: 1.375 },
    headingLSemiBold:  { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.375 },
    headingM:          { fontSize: '1.5rem',   fontWeight: 400, lineHeight: 1.375 },
    headingMSemiBold:  { fontSize: '1.5rem',   fontWeight: 600, lineHeight: 1.375 },
    headingS:          { fontSize: '1.25rem',  fontWeight: 400, lineHeight: 1.375 },
    headingSSemiBold:  { fontSize: '1.25rem',  fontWeight: 600, lineHeight: 1.375 },

    // Body
    bodyL:         { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.5 },
    bodyLSemiBold: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.5 },
    bodyM:         { fontSize: '1rem',     fontWeight: 400, lineHeight: 1.5 },
    bodyMSemiBold: { fontSize: '1rem',     fontWeight: 600, lineHeight: 1.5 },
    bodyS:         { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    bodySSemiBold: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },

    // Link
    linkL: { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.5, textDecoration: 'underline' },
    linkM: { fontSize: '1rem',     fontWeight: 400, lineHeight: 1.5, textDecoration: 'underline' },
    linkS: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5, textDecoration: 'underline' },

    // Label
    label: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.05em', textTransform: 'uppercase' as const },
  },
} as const;

export type TypographyToken = typeof typography;
export type TypeStyleKey = keyof typeof typography.typeStyles;
