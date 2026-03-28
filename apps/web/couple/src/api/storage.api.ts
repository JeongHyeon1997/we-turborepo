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
 * POST /api/storage/upload 🔒 — 파일 직접 업로드 (서버 경유, CORS 이슈 없음)
 * presigned PUT 방식 대신 이 함수를 사용한다.
 */
export async function uploadFile(
  file: File,
  folder: string,
  resourceId: string,
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `image.${ext}`;
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  form.append('resourceId', resourceId);
  form.append('fileName', fileName);
  const { data } = await $axios.post<{ path: string }>('/api/storage/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return getFileUrl(data.path);
}

/**
 * 파일 프록시 URL 반환 — Supabase URL을 노출하지 않고 API 서버 경유
 * <img src={getFileUrl(path)} /> 또는 저장 값으로 사용
 */
export const getFileUrl = (path: string): string =>
  `${import.meta.env.VITE_API_URL}/api/storage/files/${path}`;
