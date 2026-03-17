import type { Timestamps, PaginationQuery, PageResult } from './common.types';

// ─── Base (DB Table: announcements) ──────────────────────────────────────────

export interface AnnouncementBase extends Timestamps {
  id: string;
  title: string;
  content: string;
  important: boolean;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/** GET /announcements 쿼리 */
export type AnnouncementListQuery = PaginationQuery;

/** GET /announcements 응답 */
export type AnnouncementListResponse = PageResult<AnnouncementBase>;

/** GET /announcements/:id 응답 */
export type AnnouncementDetailResponse = AnnouncementBase;
