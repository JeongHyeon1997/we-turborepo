import { useState } from 'react';
import { DiaryFeature } from '@we/ui';
import type { Mood, DiaryEntry } from '@we/utils';
import { myDiaryEntries } from '../data/diaryEntries';

const MOODS: Mood[] = [
  { emoji: '🎉', label: '신났어요',   color: '#FFD93D' },
  { emoji: '🥰', label: '애교부려요', color: '#FF6B9D' },
  { emoji: '😌', label: '얌전해요',   color: '#74B9FF' },
  { emoji: '😴', label: '졸려요',     color: '#A29BFE' },
  { emoji: '🍖', label: '배고파요',   color: '#FDCB6E' },
  { emoji: '🤒', label: '아파요',     color: '#8BA4B8' },
  { emoji: '🐾', label: '장난꾸러기', color: '#FD79A8' },
  { emoji: '⚡', label: '활발해요',   color: '#FF7675' },
];

export function DiaryScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>(myDiaryEntries);
  return (
    <DiaryFeature
      accentColor="#97A4D9"
      moods={MOODS}
      moodModalTitle={'오늘 우리 아이는\n어땠나요? 🐾'}
      entries={entries}
      onAddEntry={e => setEntries(prev => [e, ...prev])}
    />
  );
}
