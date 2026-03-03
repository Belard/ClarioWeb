/**
 * SidebarActionButton — the primary action button pinned to the sidebar bottom.
 *
 * Dark background, white text, full-width — matches the "Criar Post" CTA in the design.
 */
import { colors, spacing, borderRadius } from '@/theme';
import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/icons';
import { useState, type CSSProperties } from 'react';

interface SidebarActionButtonProps {
  label: string;
  icon?: IconName;
  onClick?: () => void;
}

export function SidebarActionButton({ label, icon, onClick }: SidebarActionButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.button,
        ...(hovered ? styles.buttonHover : {}),
      }}
    >
      {icon && <Icon name={icon} size={16} color={colors.white} />}
      <span>{label}</span>
    </button>
  );
}

const styles: Record<string, CSSProperties> = {
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    width: '100%',
    padding: `${spacing[3]} ${spacing[4]}`,
    border: 'none',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[90],
    color: colors.white,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 150ms ease',
    boxSizing: 'border-box',
  },
  buttonHover: {
    backgroundColor: colors.neutral[100],
  },
};
