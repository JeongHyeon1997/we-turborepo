import { create } from 'zustand';
import type { DiaryEntry } from '@we/utils';
import { myDiaryEntries } from './diaryEntries';

interface DiaryState {
  entries: DiaryEntry[];
  addEntry: (entry: DiaryEntry) => void;
  setEntries: (entries: DiaryEntry[]) => void;
}

export const useDiaryStore = create<DiaryState>()((set, get) => ({
  entries: [...myDiaryEntries],
  addEntry: (entry) => set({ entries: [entry, ...get().entries] }),
  setEntries: (entries) => set({ entries }),
}));

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const getEntries = () => useDiaryStore.getState().entries;
export const addEntry = (entry: DiaryEntry) => useDiaryStore.getState().addEntry(entry);
export const useDiaryEntries = () =>
  useDiaryStore((s) => ({ entries: s.entries, addEntry: s.addEntry }));
