/**
 * SVG icon registry — imports SVG files directly from /assets via vite-plugin-svgr.
 *
 * To add a new icon:
 *   1. Drop the .svg file in the appropriate assets folder
 *   2. Import it here with `?react` suffix
 *   3. Add it to `iconMap`
 *
 * The <Icon /> wrapper consumes this map.
 */

// ── Navigation icons (Material Design — from assets/action & editor) ───────
import DashboardIcon from '@/assets/action/dashboard.svg?react';
import EditIcon from '@/assets/editor/mode_edit.svg?react';
import HistoryIcon from '@/assets/action/history.svg?react';

// ── Action icons ───────────────────────────────────────────────────────────
import VisibilityIcon from '@/assets/action/visibility.svg?react';
import VisibilityOffIcon from '@/assets/action/visibility_off.svg?react';
import AddIcon from '@/assets/content/add.svg?react';
import CloseIcon from '@/assets/navigation/close.svg?react';
import AttachmentIcon from '@/assets/file/attachment.svg?react';
import ImageIcon from '@/assets/image/image.svg?react';

// ── Social / platform icons (branded — from assets/social_icons) ───────────
import FacebookIcon from '@/assets/social_icons/Facebook/Original.svg?react';
import InstagramIcon from '@/assets/social_icons/Instagram/Original.svg?react';
import YoutubeIcon from '@/assets/social_icons/YouTube/Original.svg?react';
import TikTokIcon from '@/assets/social_icons/TikTok/Original.svg?react';

// ── Map for lookup by name ─────────────────────────────────────────────────

export const iconMap = {
  dashboard: DashboardIcon,
  edit: EditIcon,
  history: HistoryIcon,
  visibility: VisibilityIcon,
  visibilityOff: VisibilityOffIcon,
  add: AddIcon,
  close: CloseIcon,
  attachment: AttachmentIcon,
  image: ImageIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  tiktok: TikTokIcon,
} as const;

export type IconName = keyof typeof iconMap;
