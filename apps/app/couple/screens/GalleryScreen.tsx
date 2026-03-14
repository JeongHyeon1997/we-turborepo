import { GalleryFeature } from '@we/ui';
import { myDiaryEntries } from '../data/diaryEntries';

export function GalleryScreen() {
  return <GalleryFeature accentColor="#f4a0a0" entries={myDiaryEntries} />;
}
