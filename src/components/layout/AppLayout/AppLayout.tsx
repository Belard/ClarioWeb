/**
 * AppLayout — the top-level page shell.
 *
 * Provides Header + Sidebar + scrollable content area so every page
 * only needs to supply its `children` and sidebar configuration.
 *
 * Usage:
 *   <AppLayout sidebarConfig={sidebarConfig}>
 *     <MyPageContent />
 *   </AppLayout>
 */
import { colors, typography } from '@/theme';
import { Sidebar, SIDEBAR_WIDTH } from '@/components/layout/Sidebar/Sidebar';
import type { SidebarConfig } from '@/components/layout/Sidebar/Sidebar.types';
import type { CSSProperties, ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  sidebarConfig: SidebarConfig;
}

export function AppLayout({ children, sidebarConfig }: AppLayoutProps) {
  return (
    <div style={styles.root}>
      <Sidebar {...sidebarConfig} />
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  root: {
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: colors.primary[500],
    fontFamily: typography.fontFamily.generalSans.join(', '),
    margin: 0,
    padding: 0,
  },
  main: {
    marginLeft: SIDEBAR_WIDTH,
    paddingTop: '3.5rem', // Header height
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
};
