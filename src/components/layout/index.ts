/**
 * Layout components — barrel export.
 *
 * Add one export line per component as you create them, e.g.:
 *   export { Footer } from './Footer/Footer';
 */

export { Sidebar, SIDEBAR_WIDTH } from './Sidebar/Sidebar';
export { AppLayout } from './AppLayout/AppLayout';
export { AuthLayout } from './AuthLayout/AuthLayout';
export { ProtectedRoute } from './ProtectedRoute/ProtectedRoute';
export type { SidebarConfig, SidebarNavItemConfig, SidebarPlatformConfig } from './Sidebar/Sidebar.types';
