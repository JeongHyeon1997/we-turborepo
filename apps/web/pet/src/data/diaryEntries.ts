import type { DiaryEntry } from '@we/utils';

export const myDiaryEntries: DiaryEntry[] = [
  {
    id: 'd1',
    title: '산책 너무 좋아!',
    content: '오늘 공원에서 산책했는데 꼬리를 엄청 흔들었어요. 다람쥐를 보고 한참 쫓아다녔지 뭐예요.',
    mood: '🎉',
    moodLabel: '신났어요',
    moodColor: '#FFD93D',
    createdAt: '2026-03-10T19:00:00Z',
  },
  {
    id: 'd2',
    title: '병원 다녀왔어요',
    content: '정기 검진 받으러 갔다 왔어요. 의사 선생님이 건강하다고 하셨어요! 돌아오는 길에 간식 사줬더니 금방 기분 나아졌어요.',
    mood: '🤒',
    moodLabel: '아파요',
    moodColor: '#8BA4B8',
    createdAt: '2026-03-07T14:00:00Z',
  },
  {
    id: 'd3',
    title: '낮잠 삼매경',
    content: '오늘은 하루 종일 햇빛 드는 창가에서 낮잠만 잤어요. 가끔 배 만져주면 그루릉 소리를 내줬어요.',
    mood: '😴',
    moodLabel: '졸려요',
    moodColor: '#A29BFE',
    createdAt: '2026-03-03T16:00:00Z',
  },
  {
    id: 'd4',
    title: '간식 달라고 난리',
    content: '밥 먹은 지 한 시간도 안 됐는데 간식 그릇 앞에서 앉아서 눈 초롱초롱하게 쳐다봤어요. 결국 조금 줬어요.',
    mood: '🍖',
    moodLabel: '배고파요',
    moodColor: '#FDCB6E',
    createdAt: '2026-02-28T18:30:00Z',
  },
];
