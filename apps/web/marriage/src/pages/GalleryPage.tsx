import { GalleryFeature } from '@we/ui-web';
import { useDiaryEntries } from '../data/diaryStore';

export function GalleryPage() {
  const { entries } = useDiaryEntries();
  return <GalleryFeature accentColor="#c9a96e" entries={entries} />;
}
