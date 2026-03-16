import { DiaryScreen } from './DiaryScreen';

interface Props {
  onAnnouncementPress: (id: string) => void;
}

export function MyPetScreen({ onAnnouncementPress }: Props) {
  return <DiaryScreen onAnnouncementPress={onAnnouncementPress} />;
}
