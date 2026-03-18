import { $axios } from '../lib/$axios';
import type {
  AnnouncementListQuery,
  AnnouncementListResponse,
  AnnouncementDetailResponse,
} from '@we/utils';

/** GET /api/announcements */
export const getAnnouncements = (query: AnnouncementListQuery) =>
  $axios.get<AnnouncementListResponse>('/api/announcements', { params: query });

/** GET /api/announcements/:id */
export const getAnnouncement = (id: string) =>
  $axios.get<AnnouncementDetailResponse>(`/api/announcements/${id}`);
