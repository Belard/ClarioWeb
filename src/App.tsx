import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context';
import { AppLayout, ProtectedRoute } from '@/components';
import {
  DashboardPage,
  CreatePostPage,
  HistoryPage,
  LoginPage,
  SignUpPage,
  SettingsPage,
} from '@/pages';
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
      { id: 'dashboard', label: t('sidebar.nav.dashboard'), icon: 'dashboard' },
      { id: 'create-post', label: t('sidebar.nav.createPost'), icon: 'edit' },
      { id: 'history', label: t('sidebar.nav.history'), icon: 'history' },
      { id: 'settings', label: t('sidebar.nav.settings'), icon: 'settings' },
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

/** Main authenticated app shell with sidebar navigation. */
function AuthenticatedApp() {
  const sidebarConfig = useSidebarConfig();

  return (
    <AppLayout sidebarConfig={sidebarConfig}>
      {sidebarConfig.activeNavId === 'dashboard' && <DashboardPage />}
      {sidebarConfig.activeNavId === 'create-post' && <CreatePostPage />}
      {sidebarConfig.activeNavId === 'history' && <HistoryPage />}
      {sidebarConfig.activeNavId === 'settings' && <SettingsPage />}
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
