import { createDiaryStore } from '@we/utils';
import { myDiaryEntries } from './diaryEntries';

export const { useDiaryStore, getEntries, addEntry, useDiaryEntries } =
  createDiaryStore(myDiaryEntries);
