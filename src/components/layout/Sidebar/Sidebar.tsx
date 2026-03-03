/**
 * Sidebar — the main left sidebar composition.
 *
 * Accepts a declarative `SidebarConfig` so every page can supply its own
 * navigation, platforms, and action button without touching layout code.
 *
 * Usage:
 *   <Sidebar
 *     navItems={[{ id: 'dashboard', label: 'Painel', icon: 'dashboard' }]}
 *     activeNavId="dashboard"
 *     onNavClick={(id) => navigate(id)}
 *     platforms={[{ id: 'fb', name: 'Facebook', icon: 'facebook', metric: '10k' }]}
 *     actionLabel="Criar Post"
 *     actionIcon="edit"
 *     onActionClick={() => {}}
 *   />
 */
import { colors, spacing, shadows } from '@/theme';
import { useTranslation } from 'react-i18next';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarSection } from './SidebarSection';
import { SidebarPlatformItem } from './SidebarPlatformItem';
import { SidebarActionButton } from './SidebarActionButton';
import type { SidebarConfig } from './Sidebar.types';
import type { CSSProperties } from 'react';

/** Sidebar width constant — importable by AppLayout and other consumers. */
export const SIDEBAR_WIDTH = 240;

export function Sidebar({
  navItems,
  activeNavId,
  onNavClick,
  platforms = [],
  actionLabel,
  actionIcon,
  onActionClick,
}: SidebarConfig) {
  const { t } = useTranslation();

  return (
    <aside style={styles.aside}>
      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div style={styles.body}>
        {/* Navigation */}
        {navItems.length > 0 && (
          <div style={{ padding: `${spacing[4]} ${spacing[3]}` }}>
            <SidebarSection>
                {navItems.map((item) => (
                <SidebarNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={item.id === activeNavId}
                    onClick={() => onNavClick?.(item.id)}
                />
                ))}
            </SidebarSection>
          </div>
        )}

        {/* Platforms */}
        {platforms.length > 0 && (
          <div style={{ padding: `${spacing[4]} ${spacing[2]}` }}>
            <SidebarSection title={t('sidebar.platforms')}>
                {platforms.map((p) => (
                <SidebarPlatformItem
                    key={p.id}
                    icon={p.icon}
                    name={p.name}
                    metric={p.metric}
                />
                ))}
            </SidebarSection>
          </div>
        )}
      </div>

      {/* ── Sticky bottom action ──────────────────────────────────────────── */}
      {actionLabel && (
        <div style={styles.footer}>
          <SidebarActionButton
            label={actionLabel}
            icon={actionIcon}
            onClick={onActionClick}
          />
        </div>
      )}
    </aside>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  aside: {
    position: 'fixed',
    top: '3.5rem', // sits below the Header (56 px)
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
    borderRight: `1px solid ${colors.neutral[40]}`,
    boxShadow: shadows.sm,
    zIndex: 100,
    boxSizing: 'border-box',
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[8],
    overflowY: 'auto',
  },
  footer: {
    padding: `${spacing[3]} ${spacing[3]}`,
    borderTop: `1px solid ${colors.neutral[40]}`,
  },
};
