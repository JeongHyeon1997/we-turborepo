import { useState, useEffect } from 'react';
import { GalleryFeature } from '@we/ui-web';
import type { DiaryEntry } from '@we/utils';
import type { MarriageDiaryEntry } from '@we/utils';
import { getDiaryGallery } from '../api/diary.api';
import { useAuth } from '../data/authStore';
import { useDiaryEntries } from '../data/diaryRepo';

function toLocal(e: MarriageDiaryEntry): DiaryEntry {
  return {
    id: e.id,
    title: e.title ?? '',
    content: e.content,
    mood: e.mood ?? undefined,
    moodLabel: e.moodLabel ?? undefined,
    moodColor: e.moodColor ?? undefined,
    image: e.imageUrl ?? undefined,
    createdAt: e.createdAt,
  };
}

export function GalleryPage() {
  const { isLoggedIn } = useAuth();
  const { entries: localEntries } = useDiaryEntries();
  const [apiEntries, setApiEntries] = useState<DiaryEntry[] | null>(null);

  useEffect(() => {
    if (!isLoggedIn) { setApiEntries(null); return; }
    getDiaryGallery().then(res => {
      setApiEntries(res.data.content.map(toLocal));
    }).catch(() => setApiEntries(null));
  }, [isLoggedIn]);

  const entries = isLoggedIn && apiEntries !== null ? apiEntries : localEntries;
  return <GalleryFeature accentColor="#c9a96e" entries={entries} />;
}
