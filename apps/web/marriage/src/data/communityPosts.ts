import type { CommunityPost } from '@we/utils';

export const communityPosts: CommunityPost[] = [
  {
    id: '1',
    author: { name: '신혼부부', avatarColor: '#f5d78e' },
    content: '오늘 남편이 깜짝 이벤트를 해줬어요 🎉 꽃다발과 함께 결혼기념일 선물도 준비해줬답니다. 너무 감동받았어요! 다들 오늘도 행복한 하루 보내세요 💍',
    image: 'https://picsum.photos/seed/marriage1/600/400',
    likes: 52,
    comments: 11,
    createdAt: '2026-03-14T10:30:00Z',
  },
  {
    id: '2',
    author: { name: '허니문중', avatarColor: '#f8e3a8' },
    content: '신혼여행지 추천해주세요! 유럽이랑 동남아 중에 고민 중인데 어디가 더 좋을까요? 😊',
    image: null,
    likes: 18,
    comments: 34,
    createdAt: '2026-03-14T09:00:00Z',
  },
  {
    id: '3',
    author: { name: '행복한결혼', avatarColor: '#d4a574' },
    content: '신혼집 인테리어 공유해요 🏠 북유럽 스타일로 꾸몄는데 생각보다 분위기가 너무 좋아요. 함께 고른 가구들이 너무 예쁘게 어울려요!',
    image: 'https://picsum.photos/seed/marriage3/600/400',
    likes: 78,
    comments: 15,
    createdAt: '2026-03-13T18:45:00Z',
  },
  {
    id: '4',
    author: { name: '결혼2년차', avatarColor: '#e0bc98' },
    content: '결혼 2년차인데 아직도 설레는 분들 계신가요? 저는 매일매일이 너무 행복한데 이게 정상인 건지 😄 남편이랑 저만 이런 건 아닌지 궁금해요!',
    image: null,
    likes: 45,
    comments: 56,
    createdAt: '2026-03-13T14:20:00Z',
  },
  {
    id: '5',
    author: { name: '주말부부탈출', avatarColor: '#fbedcc' },
    content: '드디어 주말부부 끝났어요! 이제 매일 같이 밥 먹을 수 있다니 너무 좋아요 ✨ 이직하길 정말 잘한 것 같아요!',
    image: 'https://picsum.photos/seed/marriage5/600/400',
    likes: 93,
    comments: 22,
    createdAt: '2026-03-12T20:10:00Z',
  },
];
