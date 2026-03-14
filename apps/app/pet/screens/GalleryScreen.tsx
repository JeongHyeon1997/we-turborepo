import { GalleryFeature } from '@we/ui';
import { myDiaryEntries } from '../data/diaryEntries';

export function GalleryScreen() {
  return <GalleryFeature accentColor="#97A4D9" entries={myDiaryEntries} />;
}
