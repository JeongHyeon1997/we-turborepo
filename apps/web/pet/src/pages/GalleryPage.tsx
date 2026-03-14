import { GalleryFeature } from '@we/ui-web';
import { useDiaryEntries } from '../data/diaryStore';

export function GalleryPage() {
  const { entries } = useDiaryEntries();
  return <GalleryFeature accentColor="#97A4D9" entries={entries} />;
}
