import { useNavigate } from 'react-router-dom';
import { DiaryFeature, AnnouncementBanner } from '@we/ui-web';
import type { Mood } from '@we/utils';
import { useDiaryEntries } from '../data/diaryRepo';
import { announcements } from '../data/announcements';

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

export function DiaryPage() {
  const navigate = useNavigate();
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useDiaryEntries();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#f4a0a0"
        onPress={(id) => navigate(`/announcements/${id}`)}
      />
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <DiaryFeature
          accentColor="#f4a0a0"
          moods={MOODS}
          moodModalTitle={'오늘의 기분은\n어떠셨나요? 🌸'}
          entries={entries}
          loading={loading}
          onAddEntry={addEntry}
          onUpdateEntry={updateEntry}
          onDeleteEntry={deleteEntry}
        />
      </div>
    </div>
  );
}
