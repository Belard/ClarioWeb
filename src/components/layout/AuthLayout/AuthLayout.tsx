/**
 * AuthLayout — split-screen layout for Login & Sign Up pages.
 *
 * Left panel: solid gray background (50% width).
 * Right panel: white background with centered form content.
 * Responsive: hides left panel below 768px.
 */
import type { CSSProperties, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.leftPanel} />
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
  },
  leftPanel: {
    flex: '0 0 50%',
    backgroundColor: '#a8a8a8',
  },
  rightPanel: {
    flex: '0 0 50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '2rem',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
  },
};
