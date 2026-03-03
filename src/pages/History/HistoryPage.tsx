import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

export function HistoryPage() {
  const { t } = useTranslation();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{t('sidebar.nav.history')}</h1>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#333',
  },
};
