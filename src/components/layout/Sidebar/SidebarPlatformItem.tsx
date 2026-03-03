/**
 * SidebarPlatformItem — a connected social-media platform row.
 *
 * Shows the platform icon, name, and an optional metric badge (e.g. "10k").
 */
import { colors, spacing, borderRadius } from '@/theme';
import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/icons';
import type { CSSProperties } from 'react';

interface SidebarPlatformItemProps {
  icon: IconName;
  name: string;
  /** Formatted follower / subscriber count — shown as a badge. */
  metric?: string;
}

export function SidebarPlatformItem({ icon, name, metric }: SidebarPlatformItemProps) {
  return (
    <div style={styles.row}>
      <Icon name={icon} size={20} />
      <span style={styles.name}>{name}</span>
      {metric && <span style={styles.badge}>{metric}</span>}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    width: '100%',
    padding: `${spacing[2]} ${spacing[3]}`,
    boxSizing: 'border-box',
  },
  name: {
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: 400,
    color: colors.neutral[90],
    lineHeight: 1.4,
    whiteSpace: 'nowrap' as const,
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: colors.neutral[80],
    backgroundColor: colors.neutral[30],
    borderRadius: borderRadius.base,
    padding: `${spacing[0.5]} ${spacing[1.5]}`,
    lineHeight: 1,
  },
};
