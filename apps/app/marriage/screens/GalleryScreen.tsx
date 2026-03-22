import { GalleryFeature } from '@we/ui';
import { myDiaryEntries } from '../data/diaryEntries';

export function GalleryScreen() {
  return <GalleryFeature accentColor="#c9a96e" entries={myDiaryEntries} />;
}
