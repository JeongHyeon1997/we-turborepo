import { useState } from 'react';
import { DiaryFeature } from '@we/ui';
import type { Mood, DiaryEntry } from '@we/utils';
import { myDiaryEntries } from '../data/diaryEntries';

const MOODS: Mood[] = [
  { emoji: '😊', label: '행복해요', color: '#FFD93D' },
  { emoji: '🥰', label: '설레요',   color: '#FF6B9D' },
  { emoji: '😌', label: '평온해요', color: '#74B9FF' },
  { emoji: '🤔', label: '고민돼요', color: '#FDCB6E' },
  { emoji: '😢', label: '슬퍼요',   color: '#8BA4B8' },
  { emoji: '😤', label: '화나요',   color: '#FF7675' },
  { emoji: '😴', label: '피곤해요', color: '#A29BFE' },
  { emoji: '🌸', label: '두근두근', color: '#FD79A8' },
];

export function DiaryScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>(myDiaryEntries);
  return (
    <DiaryFeature
      accentColor="#f4a0a0"
      moods={MOODS}
      moodModalTitle={'오늘의 기분은\n어떠셨나요? 🌸'}
      entries={entries}
      onAddEntry={e => setEntries(prev => [e, ...prev])}
    />
  );
}
