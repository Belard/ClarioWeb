import type {
  CredentialsStatusResponse,
  DisconnectPlatformRequest,
  SaveCredentialsRequest,
} from '@/types';
import { request } from './api';

const CREDENTIALS_TIMEOUT_MS = 15000;

export async function getConnectedPlatforms(): Promise<CredentialsStatusResponse> {
  return request<CredentialsStatusResponse>('/api/credentials/status', {
    method: 'GET',
    timeoutMs: CREDENTIALS_TIMEOUT_MS,
  });
}

export async function saveCredentials(payload: SaveCredentialsRequest): Promise<void> {
  await request('/api/credentials', {
    method: 'POST',
    body: payload,
    timeoutMs: CREDENTIALS_TIMEOUT_MS,
  });
}

export async function disconnectPlatform(payload: DisconnectPlatformRequest): Promise<void> {
  await request('/api/credentials/disconnect', {
    method: 'DELETE',
    body: payload,
    timeoutMs: CREDENTIALS_TIMEOUT_MS,
  });
}
