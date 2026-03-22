import { $axios } from '../lib/$axios';
import type {
  AnnouncementListResponse,
  AnnouncementDetailResponse,
} from '@we/utils';

/** GET /api/announcement */
export const getAnnouncementList = () =>
  $axios.get<AnnouncementListResponse>('/api/announcement');

/** GET /api/announcement/:id */
export const getAnnouncement = (id: string) =>
  $axios.get<AnnouncementDetailResponse>(`/api/announcement/${id}`);
