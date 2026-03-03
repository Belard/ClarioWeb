import { useState } from 'react';
import { AppLayout } from '@/components';
import type { SidebarConfig } from '@/components';
import './App.css';

/**
 * Default sidebar configuration.
 * Each page can override this — just pass a different config to <AppLayout>.
 */
function useSidebarConfig(): SidebarConfig {
  const [activeNav, setActiveNav] = useState('create-post');

  return {
    navItems: [
      { id: 'dashboard',   label: 'Painel',     icon: 'dashboard' },
      { id: 'create-post', label: 'Criar Post',  icon: 'edit' },
      { id: 'history',     label: 'Histórico',   icon: 'history' },
    ],
    activeNavId: activeNav,
    onNavClick: setActiveNav,

    platforms: [
      { id: 'facebook',  name: 'Facebook',  icon: 'facebook',  metric: '10k' },
      { id: 'instagram', name: 'Instagram', icon: 'instagram', metric: '10k' },
      { id: 'youtube',   name: 'Youtube',   icon: 'youtube',   metric: '10k' },
      { id: 'tiktok',    name: 'Tik-Tok',   icon: 'tiktok',    metric: '10k' },
    ],

    actionLabel: 'Criar Post',
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
