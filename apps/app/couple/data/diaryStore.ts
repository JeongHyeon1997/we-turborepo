import { createDiaryStore } from '@we/utils';

export const { useDiaryStore, getEntries, addEntry, useDiaryEntries } =
  createDiaryStore([]);
