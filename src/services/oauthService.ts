import type { OAuthPlatform } from '@/types';

export function getOAuthStartPath(platform: OAuthPlatform): string {
  return `/api/auth/${platform}`;
}

export function startOAuth(platform: OAuthPlatform): void {
  window.location.assign(getOAuthStartPath(platform));
}
