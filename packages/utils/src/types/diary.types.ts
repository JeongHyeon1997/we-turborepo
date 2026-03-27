import type { PaginationQuery, PageResult } from './common.types';

// ─── Couple Diary ─────────────────────────────────────────────────────────────

export interface CoupleDiaryEntry {
  id: string;
  coupleConnectionId: string;
  authorId: string;
  authorNickname: string;
  title: string | null;
  content: string;
  mood: string | null;
  moodLabel: string | null;
  moodColor: string | null;
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
  mood?: string | null;
  moodLabel?: string | null;
  moodColor?: string | null;
}

/** PUT /api/couple/diary/:id 요청 */
export interface UpdateCoupleDiaryRequest {
  title?: string | null;
  content?: string | null;
  mood?: string | null;
  moodLabel?: string | null;
  moodColor?: string | null;
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
  mood: string | null;
  moodLabel: string | null;
  moodColor: string | null;
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
  petId?: string;
  title?: string | null;
  content: string;
  mood?: string | null;
  moodLabel?: string | null;
  moodColor?: string | null;
}

/** PUT /api/pet/diary/:id 요청 */
export interface UpdatePetDiaryRequest {
  title?: string | null;
  content?: string | null;
  mood?: string | null;
  moodLabel?: string | null;
  moodColor?: string | null;
}

// ─── Marriage Diary ───────────────────────────────────────────────────────────

export interface MarriageDiaryEntry {
  id: string;
  marriageConnectionId: string;
  authorId: string;
  authorNickname: string;
  title: string | null;
  content: string;
  mood: string | null;
  moodLabel: string | null;
  moodColor: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MarriageDiaryListQuery = PaginationQuery;
export type MarriageDiaryListResponse = PageResult<MarriageDiaryEntry>;
export type MarriageDiaryDetailResponse = MarriageDiaryEntry;

/** POST /api/marriage/diary 요청 */
export interface CreateMarriageDiaryRequest {
  title?: string | null;
  content: string;
  mood?: string | null;
  moodLabel?: string | null;
  moodColor?: string | null;
}

/** PUT /api/marriage/diary/:id 요청 */
export interface UpdateMarriageDiaryRequest {
  title?: string | null;
  content?: string | null;
  mood?: string | null;
  moodLabel?: string | null;
  moodColor?: string | null;
}
