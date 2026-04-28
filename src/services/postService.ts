import type { CreatePostRequest, Post, UploadedMedia, UploadMediaResponse } from '@/types';
import { request } from './api';

const PUBLISH_TIMEOUT_MS = 15000;
const MEDIA_UPLOAD_TIMEOUT_MS = 30000;

export async function createPost(payload: CreatePostRequest): Promise<Post> {
  return request<Post>('/api/posts', {
    method: 'POST',
    body: payload,
    timeoutMs: PUBLISH_TIMEOUT_MS,
  });
}

export async function uploadMedia(file: File): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await request<UploadMediaResponse>('/api/media', {
    method: 'POST',
    body: formData,
    timeoutMs: MEDIA_UPLOAD_TIMEOUT_MS,
  });

  const id = response.id ?? response.media?.id;

  if (!id) {
    throw new Error('Media upload response did not include an id.');
  }

  return {
    id,
    filename: response.filename ?? response.media?.filename,
  };
}
