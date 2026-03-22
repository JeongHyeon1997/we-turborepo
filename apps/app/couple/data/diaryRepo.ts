import { createDiaryRepo } from '@we/utils';
import { isLoggedIn } from './authStore';
import { getEntries, addEntry as addLocalEntry, useDiaryEntries as useLocalEntries } from './diaryStore';

const repo = createDiaryRepo({ isLoggedIn, getLocalEntries: getEntries, addLocalEntry, useLocalEntries });

export const useDiaryEntries = repo.useDiaryEntries;
export const addEntry = repo.addEntry;
export { getEntries };
