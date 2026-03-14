/**
 * 펫 앱 일기 모듈 스토어
 * DiaryFeature ↔ GalleryFeature 간 실시간 상태 공유를 위해 사용합니다.
 */
import { useState, useEffect } from 'react';
import type { DiaryEntry } from '@we/utils';
import { myDiaryEntries } from './diaryEntries';

let _entries: DiaryEntry[] = [...myDiaryEntries];
const _subs = new Set<() => void>();

export function getEntries() {
  return _entries;
}

export function addEntry(e: DiaryEntry) {
  _entries = [e, ..._entries];
  _subs.forEach(fn => fn());
}

export function useDiaryEntries() {
  const [entries, setEntries] = useState(_entries);
  useEffect(() => {
    const update = () => setEntries([..._entries]);
    _subs.add(update);
    return () => { _subs.delete(update); };
  }, []);
  return { entries, addEntry };
}
