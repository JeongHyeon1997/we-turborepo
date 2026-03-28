import { $axios } from '../lib/$axios';
import type {
  MarriageDiaryListQuery,
  MarriageDiaryListResponse,
  MarriageDiaryDetailResponse,
  CreateMarriageDiaryRequest,
  MarriageDiaryEntry,
} from '@we/utils';

/** GET /api/marriage/diary 🔒 */
export const getDiaryList = (query: MarriageDiaryListQuery) =>
  $axios.get<MarriageDiaryListResponse>('/api/marriage/diary', { params: query });

/** GET /api/marriage/diary/:id 🔒 */
export const getDiary = (id: string) =>
  $axios.get<MarriageDiaryDetailResponse>(`/api/marriage/diary/${id}`);

/** POST /api/marriage/diary 🔒 */
export const createDiary = (req: CreateMarriageDiaryRequest) =>
  $axios.post<MarriageDiaryEntry>('/api/marriage/diary', req);

/** PUT /api/marriage/diary/:id 🔒 */
export const updateDiary = (id: string, req: { title?: string | null; content?: string | null; imageUrl?: string | null }) =>
  $axios.put<MarriageDiaryEntry>(`/api/marriage/diary/${id}`, req);

/** DELETE /api/marriage/diary/:id 🔒 */
export const deleteDiary = (id: string) =>
  $axios.delete<void>(`/api/marriage/diary/${id}`);

/** GET /api/marriage/diary/gallery 🔒 — 이미지 첨부 일기만 */
export const getDiaryGallery = (page = 0, size = 30) =>
  $axios.get<MarriageDiaryListResponse>('/api/marriage/diary/gallery', { params: { page, size } });
