import { useState, useEffect } from 'react';
import type { DiaryEntry } from '../diary';

export interface DiaryRemoteApi {
  fetchEntries: () => Promise<DiaryEntry[]>;
  createEntry: (data: Omit<DiaryEntry, 'id' | 'createdAt'>) => Promise<DiaryEntry>;
  updateEntry: (id: string, patch: { title?: string; content?: string; imageUrl?: string | null }) => Promise<DiaryEntry>;
  deleteEntry: (id: string) => Promise<void>;
}

export interface DiaryRepoDeps {
  /** 로그인 여부 reactive 훅 */
  useIsLoggedIn: () => boolean;
  /** 로컬 Zustand 스토어 훅 */
  useLocalStore: () => {
    entries: DiaryEntry[];
    setEntries: (entries: DiaryEntry[]) => void;
    addEntry: (entry: DiaryEntry) => void;
    updateEntry: (id: string, patch: Partial<DiaryEntry>) => void;
    deleteEntry: (id: string) => void;
  };
  /** 원격 API 함수 모음 (없으면 로컬 전용) */
  remote?: DiaryRemoteApi;
}

/**
 * diaryRepo 팩토리
 * - 비로그인: 로컬 스토어만 사용
 * - 로그인: 마운트 시 API 목록 로드, CRUD 시 API + 로컬 동기화
 *
 * @param refetchKey useDiaryEntries(refetchKey) — 키 변경 시 목록 재조회 (펫 탭 전환 등)
 */
export function createDiaryRepo(deps: DiaryRepoDeps) {
  return {
    useDiaryEntries: (refetchKey?: string) => {
      const store = deps.useLocalStore();
      const isLoggedIn = deps.useIsLoggedIn();
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        if (!isLoggedIn || !deps.remote) return;
        setLoading(true);
        deps.remote
          .fetchEntries()
          .then((entries) => store.setEntries(entries))
          .catch(console.error)
          .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoggedIn, refetchKey]);

      async function addEntry(data: Omit<DiaryEntry, 'id' | 'createdAt'>) {
        if (isLoggedIn && deps.remote) {
          const entry = await deps.remote.createEntry(data);
          store.addEntry(entry);
        } else {
          store.addEntry({
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          });
        }
      }

      async function updateEntry(id: string, patch: { title?: string; content?: string; imageUrl?: string | null }) {
        if (isLoggedIn && deps.remote) {
          const updated = await deps.remote.updateEntry(id, patch);
          store.updateEntry(id, updated);
        } else {
          store.updateEntry(id, patch);
        }
      }

      async function deleteEntry(id: string) {
        if (isLoggedIn && deps.remote) {
          await deps.remote.deleteEntry(id);
        }
        store.deleteEntry(id);
      }

      return { entries: store.entries, loading, addEntry, updateEntry, deleteEntry };
    },
  };
}
