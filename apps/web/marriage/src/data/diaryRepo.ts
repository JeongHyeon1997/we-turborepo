import { createDiaryRepo } from '@we/utils';
import type { DiaryRemoteApi, MarriageDiaryEntry, DiaryEntry } from '@we/utils';
import { useAuthStore } from './authStore';
import { useDiaryEntries as useLocalStore } from './diaryStore';
import { getDiaryList, createDiary, updateDiary, deleteDiary } from '../api/diary.api';

// API 응답 → 로컬 DiaryEntry 변환
function toLocal(e: MarriageDiaryEntry): DiaryEntry {
  return {
    id: e.id,
    title: e.title ?? '',
    content: e.content,
    mood: e.mood ?? undefined,
    moodLabel: e.moodLabel ?? undefined,
    moodColor: e.moodColor ?? undefined,
    createdAt: e.createdAt,
  };
}

const remote: DiaryRemoteApi = {
  fetchEntries: async () => {
    const res = await getDiaryList({ page: 0, size: 100 });
    return res.data.content.map(toLocal);
  },
  createEntry: async (data) => {
    const res = await createDiary({
      title: data.title || null,
      content: data.content,
      mood: data.mood ?? null,
      moodLabel: data.moodLabel ?? null,
      moodColor: data.moodColor ?? null,
    });
    return toLocal(res.data);
  },
  updateEntry: async (id, patch) => {
    const res = await updateDiary(id, patch);
    return toLocal(res.data);
  },
  deleteEntry: async (id) => {
    await deleteDiary(id);
  },
};

const repo = createDiaryRepo({
  useIsLoggedIn: () => useAuthStore((s) => !!s.user),
  useLocalStore,
  remote,
});

export const useDiaryEntries = repo.useDiaryEntries;
