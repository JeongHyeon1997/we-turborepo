/**
 * Diary Repository
 * - 비로그인: Zustand diaryStore (인메모리)
 * - 로그인: 로컬 우선 + 백엔드 동기화 (백엔드 미구현 시 stub)
 */
import { isLoggedIn } from './authStore';
import { getEntries, addEntry as addLocalEntry } from './diaryStore';
import type { DiaryEntry } from '@we/utils';

const remoteApi = {
  addEntry: async (_entry: DiaryEntry): Promise<void> => {
    // TODO: await $axios.post('/diary', _entry);
  },
};

export { getEntries };

export function addEntry(entry: DiaryEntry): DiaryEntry[] {
  addLocalEntry(entry);
  if (isLoggedIn()) {
    remoteApi.addEntry(entry).catch(console.error);
  }
  return getEntries();
}
