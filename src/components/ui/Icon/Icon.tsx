/**
 * Icon — renders an icon by name or as a pass-through for ReactNode icons.
 *
 * Usage:
 *   <Icon name="dashboard" size={20} color="#333" />
 */
import type { CSSProperties } from 'react';
import { iconMap, type IconName } from './icons';

interface IconProps {
  /** Icon lookup key (see icons.tsx) */
  name: IconName;
  /** Pixel size — applied to both width and height. Default: 20 */
  size?: number;
  /** CSS color applied via `color` on the wrapper (icons use currentColor). */
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, color, style }: IconProps) {
  const SvgComponent = iconMap[name];
  return <SvgComponent width={size} height={size} style={{ color, display: 'block', ...style }} />;
}
