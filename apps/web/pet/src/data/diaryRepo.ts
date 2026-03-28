import { createDiaryRepo } from '@we/utils';
import type { DiaryRemoteApi, PetDiaryEntry, DiaryEntry } from '@we/utils';
import { useAuthStore } from './authStore';
import { useDiaryEntries as useLocalStore } from './diaryStore';
import { usePetStore } from './petStore';
import { getDiaryList, createDiary, updateDiary, deleteDiary } from '../api/diary.api';

function toLocal(e: PetDiaryEntry): DiaryEntry {
  return {
    id: e.id,
    title: e.title ?? '',
    content: e.content,
    mood: e.mood ?? undefined,
    moodLabel: e.moodLabel ?? undefined,
    moodColor: e.moodColor ?? undefined,
    image: e.imageUrl ?? undefined,
    createdAt: e.createdAt,
  };
}

const remote: DiaryRemoteApi = {
  fetchEntries: async () => {
    const petId = usePetStore.getState().selectedPetId;
    // petId 없으면 서버가 내 일기 전체 반환
    const res = await getDiaryList({ petId: petId ?? undefined, page: 0, size: 100 });
    return res.data.content.map(toLocal);
  },
  createEntry: async (data) => {
    const petId = usePetStore.getState().selectedPetId;
    const res = await createDiary({
      petId: petId ?? undefined,
      title: data.title || null,
      content: data.content,
      mood: data.mood ?? null,
      moodLabel: data.moodLabel ?? null,
      moodColor: data.moodColor ?? null,
      imageUrl: data.image ?? null,
    });
    return toLocal(res.data);
  },
  updateEntry: async (id, patch) => {
    const res = await updateDiary(id, { ...patch, imageUrl: patch.imageUrl });
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
