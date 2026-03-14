/**
 * 커플 앱 일기 모듈 스토어
 * DiaryFeature ↔ GalleryFeature 간 실시간 상태 공유를 위해 사용합니다.
 * React Context / Zustand 없이 모듈 수준 pub-sub으로 구현합니다.
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

/** 컴포넌트에서 entries를 구독합니다. 새 항목이 추가되면 자동으로 리렌더됩니다. */
export function useDiaryEntries() {
  const [entries, setEntries] = useState(_entries);
  useEffect(() => {
    const update = () => setEntries([..._entries]);
    _subs.add(update);
    return () => { _subs.delete(update); };
  }, []);
  return { entries, addEntry };
}
