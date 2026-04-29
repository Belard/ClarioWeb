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
import { LogoColour, UserInfo, UserAvatar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarSection } from './SidebarSection';
import { SidebarPlatformItem } from './SidebarPlatformItem';
import type { SidebarConfig } from './Sidebar.types';
import type { CSSProperties } from 'react';

/** Sidebar width constant — importable by AppLayout and other consumers. */
export const SIDEBAR_WIDTH = 240;

export function Sidebar({
  navItems,
  activeNavId,
  onNavClick,
  platforms = [],
}: SidebarConfig) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <aside style={styles.aside}>
      {/* ── Logo header ───────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <LogoColour height={32} />
      </div>

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

      {/* ── Sticky bottom section ─────────────────────────────────────────── */}
      <div style={styles.bottomSection}>
        {/* User info footer */}
        {user && (
          <button
            type="button"
            style={styles.userFooterButton}
            onClick={() => onNavClick?.('settings')}
            aria-label={t('sidebar.openSettings')}
          >
            <div style={styles.userFooter}>
              <UserAvatar size={40} alt={user.name} />
              <UserInfo name={user.name} subtitle={user.email} />
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  aside: {
    position: 'fixed',
    top: 0,
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing[4]} ${spacing[3]}`,
    // borderBottom: `1px solid ${colors.neutral[40]}`,
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[8],
    overflowY: 'auto',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: `1px solid ${colors.neutral[40]}`,
  },
  actionContainer: {
    padding: `${spacing[3]} ${spacing[3]}`,
  },
  userFooterButton: {
    border: 'none',
    background: 'transparent',
    width: '100%',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
  },
  userFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: `${spacing[3]} ${spacing[3]}`,
    borderTop: `1px solid ${colors.neutral[40]}`,
  },
};
