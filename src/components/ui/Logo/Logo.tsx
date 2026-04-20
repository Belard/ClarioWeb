import logoAndName from '@/assets/logo_and_name.svg';
import logoandNameColour from '@/assets/logo_and_name_and_color.svg';

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

export function LogoColour({ height = 28 }: LogoProps) {
  return (
    <a href="/" style={styles.wrapper} aria-label="Clario home">
      <img src={logoandNameColour} alt="Clario" style={{ height, width: 'auto' }} />
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
