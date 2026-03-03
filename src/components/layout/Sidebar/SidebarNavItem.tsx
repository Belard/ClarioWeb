/**
 * SidebarNavItem — a single navigation entry in the sidebar.
 *
 * Renders an icon + label row. When `active`, the row gets a dark
 * background with white text to match the design.
 */
import { colors, spacing } from '@/theme';
import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/icons';
import { useState, type CSSProperties } from 'react';

interface SidebarNavItemProps {
  icon: IconName;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({ icon, label, active = false, onClick }: SidebarNavItemProps) {
  const [hovered, setHovered] = useState(false);

  const rowStyle: CSSProperties = {
    ...styles.row,
    ...(active ? styles.rowActive : {}),
    ...(!active && hovered ? styles.rowHover : {}),
  };

  const textColor = colors.neutral[90];

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={rowStyle}
    >
      <Icon name={icon} size={18} color={textColor} />
      <span style={{ ...styles.label, color: textColor }}>{label}</span>
    </button>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    width: '100%',
    padding: `${spacing[2.5]} ${spacing[3]}`,
    border: 'none',
    borderRadius: 0,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'background 150ms ease, color 150ms ease',
    boxSizing: 'border-box',
  },
  rowActive: {
    background: colors.neutral[50],
  },
  rowHover: {
    background: colors.neutral[30],
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.4,
    whiteSpace: 'nowrap' as const,
  },
};
