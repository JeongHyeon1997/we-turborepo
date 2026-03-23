/** POST /api/storage/presigned-upload-url 요청 */
export interface PresignedUploadUrlRequest {
  /** 저장 경로 (예: "diary/image.jpg") */
  path: string;
  /** MIME 타입 (예: "image/jpeg") */
  contentType: string;
}

/** POST /api/storage/presigned-upload-url 응답 */
export interface PresignedUploadUrlResponse {
  /** 업로드에 사용할 서명된 URL */
  uploadUrl: string;
  /** 업로드 후 파일 경로 (조회 시 사용) */
  path: string;
}

/** GET /api/storage/public-url 응답 */
export interface PublicUrlResponse {
  /** 공개 접근 가능한 파일 URL */
  publicUrl: string;
}

/** GET /api/storage/signed-view-url 응답 */
export interface SignedViewUrlResponse {
  /** 서명된 조회 URL (private 버킷) */
  signedUrl: string;
  /** 만료 시각 (ISO 8601) */
  expiresAt: string;
}
