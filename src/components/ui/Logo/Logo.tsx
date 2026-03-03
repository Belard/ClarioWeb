import logoAndName from '@/assets/logo_and_name.svg';

interface LogoProps {
  height?: number;
}

export function Logo({ height = 28 }: LogoProps) {
  return (
    <a href="/" style={styles.wrapper} aria-label="Clario home">
      <img src={logoAndName} alt="Clario" style={{ height, width: 'auto' }} />
    </a>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};
