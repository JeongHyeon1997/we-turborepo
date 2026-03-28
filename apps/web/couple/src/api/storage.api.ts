import { $axios } from '../lib/$axios';
import type {
  PresignedUploadUrlRequest,
  PresignedUploadUrlResponse,
  SignedViewUrlResponse,
} from '@we/utils';

/** POST /api/storage/presigned-upload-url 🔒 — 업로드 서명 URL 발급 */
export const getPresignedUploadUrl = (req: PresignedUploadUrlRequest) =>
  $axios.post<PresignedUploadUrlResponse>('/api/storage/presigned-upload-url', req);

/** GET /api/storage/signed-view-url?path=... 🔒 — 서명된 조회 URL 발급 (private 버킷) */
export const getSignedViewUrl = (path: string) =>
  $axios.get<SignedViewUrlResponse>('/api/storage/signed-view-url', { params: { path } });

/**
 * 파일 프록시 URL 반환 — Supabase URL을 노출하지 않고 API 서버 경유
 * <img src={getFileUrl(path)} /> 또는 저장 값으로 사용
 */
export const getFileUrl = (path: string): string =>
  `${import.meta.env.VITE_API_URL}/api/storage/files/${path}`;
