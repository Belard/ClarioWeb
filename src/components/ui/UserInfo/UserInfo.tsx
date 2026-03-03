import { colors, typography } from '@/theme';

interface UserInfoProps {
  name: string;
  subtitle: string;
}

export function UserInfo({ name, subtitle }: UserInfoProps) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.name}>{name}</span>
      <span style={styles.subtitle}>{subtitle}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.0625rem',
    lineHeight: 1.3,
  },
  name: {
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[90],
  },
  subtitle: {
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.normal,
    color: colors.neutral[70],
  },
};
