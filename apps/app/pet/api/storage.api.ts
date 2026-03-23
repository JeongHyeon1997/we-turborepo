import { $axios } from '../lib/$axios';
import type {
  PresignedUploadUrlRequest,
  PresignedUploadUrlResponse,
  PublicUrlResponse,
  SignedViewUrlResponse,
} from '@we/utils';

/** POST /api/storage/presigned-upload-url 🔒 — 업로드 서명 URL 발급 */
export const getPresignedUploadUrl = (req: PresignedUploadUrlRequest) =>
  $axios.post<PresignedUploadUrlResponse>('/api/storage/presigned-upload-url', req);

/** GET /api/storage/public-url?path=... — 공개 파일 URL 조회 (public 버킷) */
export const getPublicUrl = (path: string) =>
  $axios.get<PublicUrlResponse>('/api/storage/public-url', { params: { path } });

/** GET /api/storage/signed-view-url?path=... 🔒 — 서명된 조회 URL 발급 (private 버킷) */
export const getSignedViewUrl = (path: string) =>
  $axios.get<SignedViewUrlResponse>('/api/storage/signed-view-url', { params: { path } });

/**
 * GET /api/storage/files/{folder}/{id}/{filename} — 이미지 직접 리다이렉트 (302)
 * axios 없이 BASE_URL과 조합해 <Image source={{ uri }}> 에 넣는다.
 */
export const getFileRedirectUrl = (folder: string, id: string, filename: string): string => {
  const base = process.env.EXPO_PUBLIC_API_URL ?? '';
  return `${base}/api/storage/files/${folder}/${id}/${filename}`;
};
