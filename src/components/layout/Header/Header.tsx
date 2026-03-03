import { colors, shadows, spacing, zIndex } from '@/theme';
import { Logo } from '@/components/ui/Logo/Logo';
import { UserInfo } from '@/components/ui/UserInfo/UserInfo';
import { UserAvatar } from '@/components/ui/UserAvatar/UserAvatar';

interface HeaderProps {
  userName?: string;
  userSubtitle?: string;
  userAvatarSrc?: string;
}

export function Header({
  userName = 'Ana Sofia',
  userSubtitle = 'Odontopediatra',
  userAvatarSrc,
}: HeaderProps) {
  return (
    <header style={styles.bar}>
      {/* Left — Logo */}
      <Logo />

      {/* Right — User info + avatar */}
      <div style={styles.right}>
        <UserInfo name={userName} subtitle={userSubtitle} />
        <UserAvatar src={userAvatarSrc} alt={userName} />
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: zIndex.sticky,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '3.5rem',
    padding: `0 ${spacing[6]}`,
    backgroundColor: colors.white,
    boxShadow: shadows.sm,
    boxSizing: 'border-box',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
};
