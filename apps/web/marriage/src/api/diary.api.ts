import { $axios } from '../lib/$axios';
import type {
  CoupleDiaryListQuery,
  CoupleDiaryListResponse,
  CoupleDiaryDetailResponse,
  CreateCoupleDiaryRequest,
  CoupleDiaryEntry,
} from '@we/utils';

/** GET /api/marriage/diary 🔒 */
export const getDiaryList = (query: CoupleDiaryListQuery) =>
  $axios.get<CoupleDiaryListResponse>('/api/marriage/diary', { params: query });

/** GET /api/marriage/diary/:id 🔒 */
export const getDiary = (id: string) =>
  $axios.get<CoupleDiaryDetailResponse>(`/api/marriage/diary/${id}`);

/** POST /api/marriage/diary 🔒 */
export const createDiary = (req: CreateCoupleDiaryRequest) =>
  $axios.post<CoupleDiaryEntry>('/api/marriage/diary', req);

/** PUT /api/marriage/diary/:id 🔒 */
export const updateDiary = (id: string, req: { title?: string | null; content?: string | null }) =>
  $axios.put<CoupleDiaryEntry>(`/api/marriage/diary/${id}`, req);

/** DELETE /api/marriage/diary/:id 🔒 */
export const deleteDiary = (id: string) =>
  $axios.delete<void>(`/api/marriage/diary/${id}`);
