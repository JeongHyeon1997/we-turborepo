import type { CommunityPost } from '@we/utils';

export const communityPosts: CommunityPost[] = [
  {
    id: '1',
    author: { name: '골든맘', avatarColor: '#F7BFCD' },
    content: '우리 골든리트리버 뭉치가 오늘 목욕하고 너무 귀여운 모습! 목욕 후에 항상 이렇게 신나서 달려다니는 거 진짜 웃겨요 😂',
    image: 'https://picsum.photos/seed/pet1/600/400',
    likes: 54,
    comments: 11,
    createdAt: '2026-03-14T11:00:00Z',
  },
  {
    id: '2',
    author: { name: '냥집사', avatarColor: '#97A4D9' },
    content: '고양이 밥을 안 먹어서 걱정이에요 😿 처방식으로 바꿔야 하나요? 혹시 비슷한 경험 있으신 분 조언 부탁드려요!',
    image: null,
    likes: 22,
    comments: 34,
    createdAt: '2026-03-14T08:30:00Z',
  },
  {
    id: '3',
    author: { name: '말티즈부모', avatarColor: '#A5C5DB' },
    content: '봄이라 산책하기 너무 좋은 날씨네요 🌸 오늘 공원에서 다른 강아지들도 많이 만나서 솔이가 엄청 좋아했어요!',
    image: 'https://picsum.photos/seed/pet3/600/400',
    likes: 78,
    comments: 16,
    createdAt: '2026-03-13T16:00:00Z',
  },
  {
    id: '4',
    author: { name: '토끼아빠', avatarColor: '#F1F3F5' },
    content: '토끼 입양 고민 중인데 첫 반려동물로 괜찮을까요? 아파트 생활인데 소음은 어느 정도인지 궁금해요 🐰',
    image: null,
    likes: 18,
    comments: 29,
    createdAt: '2026-03-13T12:00:00Z',
  },
  {
    id: '5',
    author: { name: '시바견엄마', avatarColor: '#F7BFCD' },
    content: '시바견 사회화 훈련 후기예요! 3개월 꾸준히 했더니 이제 낯선 사람 봐도 짖지 않아요. 훈련의 중요성을 새삼 느꼈습니다 🐕',
    image: 'https://picsum.photos/seed/pet5/600/400',
    likes: 95,
    comments: 22,
    createdAt: '2026-03-12T19:00:00Z',
  },
];
