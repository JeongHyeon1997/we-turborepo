import { useState } from 'react';
import { View } from 'react-native';
import { DiaryFeature, AnnouncementBanner } from '@we/ui';
import type { Mood, DiaryEntry } from '@we/utils';
import { myDiaryEntries } from '../data/diaryEntries';
import { announcements } from '../data/announcements';

const MOODS: Mood[] = [
  { emoji: '😊', label: '행복해요', color: '#FFD93D' },
  { emoji: '🥰', label: '설레요',   color: '#FF6B9D' },
  { emoji: '😌', label: '평온해요', color: '#74B9FF' },
  { emoji: '🤔', label: '고민돼요', color: '#FDCB6E' },
  { emoji: '😢', label: '슬퍼요',   color: '#8BA4B8' },
  { emoji: '😤', label: '화나요',   color: '#FF7675' },
  { emoji: '😴', label: '피곤해요', color: '#A29BFE' },
  { emoji: '💍', label: '감사해요', color: '#c9a96e' },
];

interface Props {
  onAnnouncementPress: (id: string) => void;
}

export function DiaryScreen({ onAnnouncementPress }: Props) {
  const [entries, setEntries] = useState<DiaryEntry[]>(myDiaryEntries);
  return (
    <View style={{ flex: 1 }}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#c9a96e"
        onPress={onAnnouncementPress}
      />
      <DiaryFeature
        accentColor="#c9a96e"
        moods={MOODS}
        moodModalTitle={'오늘의 기분은\n어떠셨나요? 💍'}
        entries={entries}
        onAddEntry={e => setEntries(prev => [e, ...prev])}
      />
    </View>
  );
}
