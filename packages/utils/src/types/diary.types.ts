import type { PaginationQuery, PageResult } from './common.types';

// ─── Couple Diary ─────────────────────────────────────────────────────────────

export interface CoupleDiaryEntry {
  id: string;
  coupleConnectionId: string;
  authorId: string;
  authorNickname: string;
  title: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type CoupleDiaryListQuery = PaginationQuery;
export type CoupleDiaryListResponse = PageResult<CoupleDiaryEntry>;
export type CoupleDiaryDetailResponse = CoupleDiaryEntry;

/** POST /api/couple/diary 요청 */
export interface CreateCoupleDiaryRequest {
  title?: string | null;
  content: string;
}

/** PUT /api/couple/diary/:id 요청 */
export interface UpdateCoupleDiaryRequest {
  title?: string | null;
  content?: string | null;
}

// ─── Pet Diary ────────────────────────────────────────────────────────────────

export interface PetDiaryEntry {
  id: string;
  petId: string;
  petName: string;
  authorId: string;
  authorNickname: string;
  title: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetDiaryListQuery extends PaginationQuery {
  petId?: string;
}

export type PetDiaryListResponse = PageResult<PetDiaryEntry>;
export type PetDiaryDetailResponse = PetDiaryEntry;

/** POST /api/pet/diary 요청 */
export interface CreatePetDiaryRequest {
  petId: string;
  title?: string | null;
  content: string;
}

/** PUT /api/pet/diary/:id 요청 */
export interface UpdatePetDiaryRequest {
  title?: string | null;
  content?: string | null;
}

// ─── Legacy (DiaryFeature 내부 로컬 저장용, API 타입 아님) ──────────────────────

export interface DiaryEntryBase {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string | null;
  moodLabel: string | null;
  moodColor: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DiaryListQuery = PaginationQuery;
export type DiaryListResponse = PageResult<DiaryEntryBase>;
export type DiaryDetailResponse = DiaryEntryBase;
export type CreateDiaryRequest = Omit<DiaryEntryBase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type CreateDiaryResponse = DiaryEntryBase;
export type UpdateDiaryRequest = Partial<CreateDiaryRequest>;
export type UpdateDiaryResponse = DiaryEntryBase;
