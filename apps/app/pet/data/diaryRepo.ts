/**
 * Diary Repository
 * - 비로그인: 인메모리 로컬 스토어 사용
 * - 로그인: 로컬 우선 + 백엔드 동기화 (stub)
 */
import { isLoggedIn } from './authStore';
import { myDiaryEntries } from './diaryEntries';
import type { DiaryEntry } from '@we/utils';

// 인메모리 로컬 스토어
let _entries: DiaryEntry[] = [...myDiaryEntries];

// ── Remote stub ────────────────────────────────────────────────────────────────
const remoteApi = {
  addEntry: async (_entry: DiaryEntry): Promise<void> => {
    // TODO: await fetch('/api/diary', { method: 'POST', body: JSON.stringify(_entry) });
  },
};

// ── Public API ─────────────────────────────────────────────────────────────────
export function getEntries(): DiaryEntry[] {
  return _entries;
}

export function addEntry(entry: DiaryEntry): DiaryEntry[] {
  _entries = [entry, ..._entries];
  if (isLoggedIn()) {
    remoteApi.addEntry(entry).catch(console.error);
  }
  return _entries;
}
