import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { DiaryEntry } from '../diary';

/**
 * Zustand diaryStore 팩토리
 * @param initialEntries  앱별 초기 mock 데이터
 */
export function createDiaryStore(initialEntries: DiaryEntry[]) {
  const store = create<{
    entries: DiaryEntry[];
    addEntry: (entry: DiaryEntry) => void;
    setEntries: (entries: DiaryEntry[]) => void;
    updateEntry: (id: string, patch: Partial<DiaryEntry>) => void;
    deleteEntry: (id: string) => void;
  }>()((set, get) => ({
    entries: [...initialEntries],
    addEntry: (entry) => set({ entries: [entry, ...get().entries] }),
    setEntries: (entries) => set({ entries }),
    updateEntry: (id, patch) =>
      set({ entries: get().entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) }),
    deleteEntry: (id) =>
      set({ entries: get().entries.filter((e) => e.id !== id) }),
  }));

  return {
    useDiaryStore: store,
    getEntries: () => store.getState().entries,
    addEntry: (entry: DiaryEntry): DiaryEntry[] => {
      store.getState().addEntry(entry);
      return store.getState().entries;
    },
    useDiaryEntries: () =>
      store(
        useShallow((s) => ({
          entries: s.entries,
          addEntry: s.addEntry,
          setEntries: s.setEntries,
          updateEntry: s.updateEntry,
          deleteEntry: s.deleteEntry,
        })),
      ),
  };
}
