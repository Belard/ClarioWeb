/**
 * Sidebar type definitions.
 *
 * These interfaces define the data shapes that drive the Sidebar
 * so pages can declare their sidebar content declaratively.
 */
import type { IconName } from '@/components/ui/Icon/icons';

/** A navigation link shown in the top section of the sidebar. */
export interface SidebarNavItemConfig {
  id: string;
  label: string;
  icon: IconName;
}

/** A connected social platform shown in the "Plataformas" section. */
export interface SidebarPlatformConfig {
  id: string;
  name: string;
  icon: IconName;
  /** Formatted follower / subscriber count (e.g. "10k"). */
  metric?: string;
}

/** Props accepted by the <Sidebar /> component. */
export interface SidebarConfig {
  /** Top navigation items. */
  navItems: SidebarNavItemConfig[];
  /** Currently active nav item id. */
  activeNavId?: string;
  /** Callback when a nav item is clicked. */
  onNavClick?: (id: string) => void;

  /** Platform accounts. */
  platforms?: SidebarPlatformConfig[];

  /** Action button at the bottom. */
  actionLabel?: string;
  actionIcon?: IconName;
  onActionClick?: () => void;
}
