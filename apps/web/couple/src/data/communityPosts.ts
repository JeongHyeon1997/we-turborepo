import type { CommunityPost } from '@we/utils';

export const communityPosts: CommunityPost[] = [
  {
    id: '1',
    author: { name: '달콤한커플', avatarColor: '#f9d0d0' },
    content: '오늘 남자친구가 깜짝 이벤트를 해줬어요 🎉 너무 행복한 하루였어요! 다들 오늘 하루도 사랑하는 사람과 행복하게 보내세요 💕',
    image: 'https://picsum.photos/seed/couple1/600/400',
    likes: 42,
    comments: 8,
    createdAt: '2026-03-14T10:30:00Z',
  },
  {
    id: '2',
    author: { name: '핑크러브', avatarColor: '#fad8d8' },
    content: '100일 기념 선물 추천해주세요! 처음 사귀는 거라서 뭘 해줘야 할지 너무 고민돼요 😊',
    image: null,
    likes: 15,
    comments: 23,
    createdAt: '2026-03-14T09:00:00Z',
  },
  {
    id: '3',
    author: { name: '투게더', avatarColor: '#54d8dc' },
    content: '데이트 코스 공유해요 🌸 오늘 한강에서 피크닉하고 일몰 봤는데 너무 좋았어요. 날씨도 딱이고 음식도 맛있고!',
    image: 'https://picsum.photos/seed/couple3/600/400',
    likes: 67,
    comments: 12,
    createdAt: '2026-03-13T18:45:00Z',
  },
  {
    id: '4',
    author: { name: '달달해', avatarColor: '#fce0df' },
    content: '장거리 연애 하시는 분들 어떻게 극복하세요? 저는 3시간 거리인데 주말에만 만나는 게 너무 힘들어요 😭',
    image: null,
    likes: 31,
    comments: 45,
    createdAt: '2026-03-13T14:20:00Z',
  },
  {
    id: '5',
    author: { name: '커플스타그램', avatarColor: '#86dadb' },
    content: '1주년 기념 여행 다녀왔어요! 제주도 정말 최고예요 ✈️🌊 커플여행 추천 1위!',
    image: 'https://picsum.photos/seed/couple5/600/400',
    likes: 89,
    comments: 19,
    createdAt: '2026-03-12T20:10:00Z',
  },
];
