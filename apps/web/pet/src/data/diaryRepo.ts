/**
 * Diary Repository
 * - 비로그인: 로컬 메모리(diaryStore) 사용
 * - 로그인: 로컬 우선 + 백엔드 동기화 (백엔드 미구현 시 stub)
 */
import { isLoggedIn } from './authStore';
import { addEntry as addLocalEntry, useDiaryEntries as useLocalDiaryEntries } from './diaryStore';
import type { DiaryEntry } from '@we/utils';

// ── Remote stub (백엔드 구현 후 실제 API 호출로 교체) ─────────────────────────
const remoteApi = {
  addEntry: async (_entry: DiaryEntry): Promise<void> => {
    // TODO: await fetch('/api/diary', { method: 'POST', body: JSON.stringify(_entry) });
  },
};

// ── Public API ─────────────────────────────────────────────────────────────────
export function useDiaryEntries() {
  return useLocalDiaryEntries();
}

export function addEntry(entry: DiaryEntry) {
  addLocalEntry(entry);
  if (isLoggedIn()) {
    remoteApi.addEntry(entry).catch(console.error);
  }
}
