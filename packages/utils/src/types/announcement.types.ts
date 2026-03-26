import type { PaginationQuery, PageResult } from './common.types';

// ─── Announcement ─────────────────────────────────────────────────────────────

export interface AnnouncementBase {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  important?: boolean;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/** GET /api/announcements 쿼리 */
export type AnnouncementListQuery = PaginationQuery;

/** GET /api/announcements 응답 */
export type AnnouncementListResponse = PageResult<AnnouncementBase>;

/** GET /api/announcements/:id 응답 */
export type AnnouncementDetailResponse = AnnouncementBase;
