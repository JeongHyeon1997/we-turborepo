export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  moodLabel?: string;
  moodColor?: string;
  image?: string | null;
  createdAt: string;
}
