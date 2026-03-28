import { $axios } from '../lib/$axios';
import type {
  PetDiaryListQuery,
  PetDiaryListResponse,
  PetDiaryDetailResponse,
  CreatePetDiaryRequest,
  PetDiaryEntry,
} from '@we/utils';

/** GET /api/pet/diary — 목록 (?petId=uuid&page=0&size=20) */
export const getDiaryList = (query: PetDiaryListQuery) =>
  $axios.get<PetDiaryListResponse>('/api/pet/diary', { params: query });

/** GET /api/pet/diary/:id */
export const getDiary = (id: string) =>
  $axios.get<PetDiaryDetailResponse>(`/api/pet/diary/${id}`);

/** POST /api/pet/diary 🔒 */
export const createDiary = (req: CreatePetDiaryRequest) =>
  $axios.post<PetDiaryEntry>('/api/pet/diary', req);

/** PUT /api/pet/diary/:id 🔒 */
export const updateDiary = (id: string, req: { title?: string | null; content?: string | null; imageUrl?: string | null }) =>
  $axios.put<PetDiaryEntry>(`/api/pet/diary/${id}`, req);

/** DELETE /api/pet/diary/:id 🔒 */
export const deleteDiary = (id: string) =>
  $axios.delete<void>(`/api/pet/diary/${id}`);

/** GET /api/pet/diary/gallery 🔒 — 이미지 첨부 일기만 */
export const getDiaryGallery = (page = 0, size = 30) =>
  $axios.get<PetDiaryListResponse>('/api/pet/diary/gallery', { params: { page, size } });
