import type { DiaryEntry } from '../diary';

interface DiaryRepoDeps {
  getLocalEntries: () => DiaryEntry[];
  addLocalEntry: (entry: DiaryEntry) => DiaryEntry[];
  useLocalEntries: () => { entries: DiaryEntry[]; addEntry: (entry: DiaryEntry) => void };
  isLoggedIn: () => boolean;
}

// Remote stub — 백엔드 구현 후 실제 API 호출로 교체
const remoteApi = {
  addEntry: async (_entry: DiaryEntry): Promise<void> => {
    // TODO: $axios.post('/diary', _entry)
  },
};

/**
 * diaryRepo 팩토리
 * - 비로그인: 로컬 스토어만 사용
 * - 로그인: 로컬 우선 + 백엔드 동기화 (stub)
 */
export function createDiaryRepo(deps: DiaryRepoDeps) {
  return {
    useDiaryEntries: deps.useLocalEntries,
    getEntries: deps.getLocalEntries,
    addEntry: (entry: DiaryEntry): DiaryEntry[] => {
      const result = deps.addLocalEntry(entry);
      if (deps.isLoggedIn()) remoteApi.addEntry(entry).catch(console.error);
      return result;
    },
  };
}
