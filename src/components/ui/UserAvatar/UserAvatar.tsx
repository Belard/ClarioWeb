import { colors } from '@/theme';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

export function UserAvatar({ src, alt = 'User avatar', size = 32 }: UserAvatarProps) {
  return (
    <div
      style={{
        ...styles.container,
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
        />
      ) : (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2.5c-3.3 0-10 1.7-10 5V22h20v-2.5c0-3.3-6.7-5-10-5Z"
            fill={colors.neutral[70]}
          />
        </svg>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[40],
    overflow: 'hidden',
    flexShrink: 0,
  },
};
