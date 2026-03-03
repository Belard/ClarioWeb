/**
 * SidebarSection — a labelled group inside the sidebar.
 *
 * Renders an optional uppercase section title followed by its children.
 */
import { colors, spacing, typography } from '@/theme';
import type { CSSProperties, ReactNode } from 'react';

interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div style={styles.wrapper}>
      {title && <span style={styles.title}>{title}</span>}
      <div style={styles.list}>{children}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  title: {
    ...typography.typeStyles.label,
    color: colors.neutral[70],
    padding: `0 ${spacing[3]}`,
    userSelect: 'none',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },
};
