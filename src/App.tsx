import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '@/components';
import type { SidebarConfig } from '@/components';
import './App.css';

/**
 * Default sidebar configuration.
 * Each page can override this — just pass a different config to <AppLayout>.
 */
function useSidebarConfig(): SidebarConfig {
  const [activeNav, setActiveNav] = useState('create-post');
  const { t } = useTranslation();

  return {
    navItems: [
      { id: 'dashboard',   label: t('sidebar.nav.dashboard'),   icon: 'dashboard' },
      { id: 'create-post', label: t('sidebar.nav.createPost'),   icon: 'edit' },
      { id: 'history',     label: t('sidebar.nav.history'),      icon: 'history' },
    ],
    activeNavId: activeNav,
    onNavClick: setActiveNav,

    platforms: [
      { id: 'facebook',  name: 'Facebook',  icon: 'facebook',  metric: '10k' },
      { id: 'instagram', name: 'Instagram', icon: 'instagram', metric: '10k' },
      { id: 'youtube',   name: 'Youtube',   icon: 'youtube',   metric: '10k' },
      { id: 'tiktok',    name: 'Tik-Tok',   icon: 'tiktok',    metric: '10k' },
    ],

    actionLabel: t('sidebar.action.createPost'),
    actionIcon: 'edit',
    onActionClick: () => setActiveNav('create-post'),
  };
}

function App() {
  const sidebarConfig = useSidebarConfig();

  return (
    <AppLayout sidebarConfig={sidebarConfig}>
      {/* Page content goes here — swap based on activeNavId or a router */}
      <div />
    </AppLayout>
  );
}

export default App;
