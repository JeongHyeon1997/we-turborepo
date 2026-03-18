/** ISO 8601 타임스탬프 (DB 공통 컬럼) */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

/** 페이지네이션 쿼리 파라미터 */
export interface PaginationQuery {
  page: number;
  size: number;
}

/** 페이지네이션 응답 (Spring Data Page 포맷) */
export interface PageResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/** 공통 API 응답 래퍼 */
export interface ApiResponse<T = void> {
  success: boolean;
  data: T;
  message?: string;
}

/** 공통 API 에러 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
