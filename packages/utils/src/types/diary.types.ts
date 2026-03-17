import type { Timestamps, PaginationQuery, PageResult } from './common.types';

// ─── Base (DB Table: diary_entries) ──────────────────────────────────────────

export interface DiaryEntryBase extends Timestamps {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string | null;
  moodLabel: string | null;
  moodColor: string | null;
  imageUrl: string | null;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/** GET /diary 쿼리 */
export type DiaryListQuery = PaginationQuery;

/** GET /diary 응답 */
export type DiaryListResponse = PageResult<DiaryEntryBase>;

/** GET /diary/:id 응답 */
export type DiaryDetailResponse = DiaryEntryBase;

// ─── Write ────────────────────────────────────────────────────────────────────

/** POST /diary 요청 (multipart/form-data 이미지 포함 시) */
export type CreateDiaryRequest = Omit<DiaryEntryBase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

/** POST /diary 응답 */
export type CreateDiaryResponse = DiaryEntryBase;

/** PUT /diary/:id 요청 */
export type UpdateDiaryRequest = Partial<CreateDiaryRequest>;

/** PUT /diary/:id 응답 */
export type UpdateDiaryResponse = DiaryEntryBase;

// DELETE /diary/:id → 204 No Content
