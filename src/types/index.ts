/**
 * App-wide TypeScript type definitions — barrel export.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Shape returned by POST /api/auth/login and POST /api/auth/register */
export interface AuthResponse {
  token: string;
  user: User;
}

export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Post {
  id: string;
  userId: string;
  content: string;
  platforms: string[];
  mediaUrls?: string[];
  mediaIds?: string[];
  scheduledAt: string | null;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export type PostType = 'normal' | 'short' | 'story';

export type PrivacyLevel = 'public' | 'followers' | 'friends' | 'private';

export interface CreatePostRequest {
  content: string;
  platforms: string[];
  media_ids?: string[];
  post_type?: PostType;
  privacy_level?: PrivacyLevel;
  is_sponsored?: boolean;
  scheduled_for?: string;
}

export interface UploadMediaResponse {
  id?: string;
  filename?: string;
  media?: {
    id?: string;
    filename?: string;
    user_id?: string;
  };
}

export interface UploadedMedia {
  id: string;
  filename?: string;
}

export type OAuthPlatform = 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'youtube';

export type PublishPlatform = 'facebook' | 'instagram' | 'youtube' | 'tiktok';

export interface CredentialsStatusItem {
  platform: OAuthPlatform;
  connected?: boolean;
  expires_at?: string;
}

export interface CredentialsStatusResponse {
  platforms?: string[];
  connected_platforms?: string[];
  credentials?: CredentialsStatusItem[];
}

export interface SaveCredentialsRequest {
  platform: OAuthPlatform;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
}

export interface DisconnectPlatformRequest {
  platform: OAuthPlatform;
}

export interface PostDefaults {
  post_type: PostType;
  privacy_level: PrivacyLevel;
  is_sponsored: boolean;
  platforms: PublishPlatform[];
}
