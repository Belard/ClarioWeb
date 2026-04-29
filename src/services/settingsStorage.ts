import type { PostDefaults } from "@/types";
import { ApiError, request } from "./api";

const POST_DEFAULTS_STORAGE_KEY = "clario_post_defaults";
const POST_DEFAULTS_ENDPOINT = "/api/settings/post-defaults";

const FALLBACK_DEFAULTS: PostDefaults = {
  post_type: "normal",
  privacy_level: "public",
  is_sponsored: false,
  platforms: ["instagram"],
};

let supportsRemoteDefaults: boolean | null = null;

function normalizeDefaults(
  input: Partial<PostDefaults> | null | undefined,
): PostDefaults {
  const postType = input?.post_type ?? FALLBACK_DEFAULTS.post_type;
  const privacyLevel = input?.privacy_level ?? FALLBACK_DEFAULTS.privacy_level;
  const isSponsored = input?.is_sponsored ?? FALLBACK_DEFAULTS.is_sponsored;
  const platforms =
    Array.isArray(input?.platforms) && input.platforms.length > 0
      ? input.platforms
      : FALLBACK_DEFAULTS.platforms;

  return {
    post_type: postType,
    privacy_level: privacyLevel,
    is_sponsored: isSponsored,
    platforms,
  };
}

function readLocalDefaults(): PostDefaults {
  try {
    const rawValue = localStorage.getItem(POST_DEFAULTS_STORAGE_KEY);
    if (!rawValue) {
      return FALLBACK_DEFAULTS;
    }

    const parsed = JSON.parse(rawValue) as Partial<PostDefaults>;
    return normalizeDefaults(parsed);
  } catch {
    return FALLBACK_DEFAULTS;
  }
}

function writeLocalDefaults(defaults: PostDefaults): void {
  localStorage.setItem(POST_DEFAULTS_STORAGE_KEY, JSON.stringify(defaults));
}

function isUnsupportedEndpointError(error: unknown): boolean {
  return error instanceof ApiError && [404, 405].includes(error.status);
}

export async function loadPostDefaults(): Promise<PostDefaults> {
  if (supportsRemoteDefaults === false) {
    return readLocalDefaults();
  }

  try {
    const remoteDefaults = await request<Partial<PostDefaults>>(
      POST_DEFAULTS_ENDPOINT,
      {
        method: "GET",
        timeoutMs: 8000,
      },
    );

    supportsRemoteDefaults = true;
    const normalized = normalizeDefaults(remoteDefaults);
    writeLocalDefaults(normalized);
    return normalized;
  } catch (error) {
    if (isUnsupportedEndpointError(error)) {
      supportsRemoteDefaults = false;
    }

    return readLocalDefaults();
  }
}

export async function savePostDefaults(defaults: PostDefaults): Promise<void> {
  const normalized = normalizeDefaults(defaults);
  writeLocalDefaults(normalized);

  if (supportsRemoteDefaults === false) {
    return;
  }

  try {
    await request(POST_DEFAULTS_ENDPOINT, {
      method: "PUT",
      body: normalized,
      timeoutMs: 8000,
    });

    supportsRemoteDefaults = true;
  } catch (error) {
    if (isUnsupportedEndpointError(error)) {
      supportsRemoteDefaults = false;
      return;
    }

    // Keep local values as source of truth when remote settings endpoint is unavailable.
  }
}
