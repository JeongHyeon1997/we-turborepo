import { GalleryFeature } from '@we/ui-web';
import { useDiaryEntries } from '../data/diaryStore';

export function GalleryPage() {
  const { entries } = useDiaryEntries();
  return <GalleryFeature accentColor="#f4a0a0" entries={entries} />;
}
