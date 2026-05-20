import type { OAuthPlatform } from "@/types";
import { openCenteredPopup } from "@/utils";
import { request } from "./api";

export function getOAuthStartPath(platform: OAuthPlatform): string {
  return `/api/auth/${platform}`;
}

type OAuthStartResponse = {
  auth_url: string;
  state?: string;
};

export async function startOAuth(platform: OAuthPlatform): Promise<void> {
  const data = await request<OAuthStartResponse>(getOAuthStartPath(platform), {
    method: "GET",
  });

  if (!data.auth_url) {
    throw new Error("Missing auth_url in OAuth response.");
  }

  const popup = openCenteredPopup(data.auth_url);

  // Fallback in case popups are blocked by the browser.
  if (!popup) {
    window.location.assign(data.auth_url);
    return;
  }

  popup.focus();
}
