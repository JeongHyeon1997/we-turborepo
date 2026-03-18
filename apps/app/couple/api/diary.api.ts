import { $axios } from '../lib/$axios';
import type {
  CoupleDiaryListQuery,
  CoupleDiaryListResponse,
  CoupleDiaryDetailResponse,
  CreateCoupleDiaryRequest,
  CoupleDiaryEntry,
} from '@we/utils';

/** GET /api/couple/diary 🔒 */
export const getDiaryList = (query: CoupleDiaryListQuery) =>
  $axios.get<CoupleDiaryListResponse>('/api/couple/diary', { params: query });

/** GET /api/couple/diary/:id 🔒 */
export const getDiary = (id: string) =>
  $axios.get<CoupleDiaryDetailResponse>(`/api/couple/diary/${id}`);

/** POST /api/couple/diary 🔒 */
export const createDiary = (req: CreateCoupleDiaryRequest) =>
  $axios.post<CoupleDiaryEntry>('/api/couple/diary', req);

/** PUT /api/couple/diary/:id 🔒 */
export const updateDiary = (id: string, req: { title?: string | null; content?: string | null }) =>
  $axios.put<CoupleDiaryEntry>(`/api/couple/diary/${id}`, req);

/** DELETE /api/couple/diary/:id 🔒 */
export const deleteDiary = (id: string) =>
  $axios.delete<void>(`/api/couple/diary/${id}`);
