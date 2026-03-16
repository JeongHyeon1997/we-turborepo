import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { petColors } from '@we/utils';
import type { CommunityPost } from '@we/utils';
import { AnnouncementBanner } from '@we/ui-web';
import { communityPosts } from '../data/communityPosts';
import { announcements } from '../data/announcements';

const myName = '우리아이';
const mockUser = { nickname: myName, profileImage: null as string | null, followers: 84, following: 32 };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function CommunityItem({ post }: { post: CommunityPost }) {
  return (
    <div style={s.item}>
      {post.image && <img src={post.image} alt="" style={s.itemThumb} />}
      <div style={s.itemBody}>
        <p style={s.itemContent}>{post.content}</p>
        <span style={s.itemMeta}>{formatDate(post.createdAt)} · 🤍 {post.likes}</span>
      </div>
    </div>
  );
}

export function MyInfoPage() {
  const navigate = useNavigate();
  const myCommunityPosts = communityPosts.filter(p => p.author.name === myName);

  return (
    <div style={s.page}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#97A4D9"
        onPress={(id) => navigate(`/announcements/${id}`)}
      />
      {/* Profile header */}
      <div style={s.profileSection}>
        <div style={s.avatarWrap}>
          {mockUser.profileImage ? (
            <img src={mockUser.profileImage} alt="프로필" style={s.avatar} />
          ) : (
            <div style={s.avatarPlaceholder}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill={petColors.gray400}>
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>

        <p style={s.nickname}>{mockUser.nickname}</p>

        <div style={s.statsRow}>
          <div style={s.statItem}>
            <span style={s.statNumber}>{mockUser.followers}</span>
            <span style={s.statLabel}>팔로워</span>
          </div>
          <div style={s.divider} />
          <div style={s.statItem}>
            <span style={s.statNumber}>{mockUser.following}</span>
            <span style={s.statLabel}>팔로잉</span>
          </div>
        </div>

        <button style={s.editButton}>프로필 편집</button>
      </div>

      {/* Posts */}
      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>커뮤니티 글</span>
        <span style={s.sectionCount}>{myCommunityPosts.length}</span>
      </div>

      <div style={s.feed}>
        {myCommunityPosts.length === 0 && <p style={s.empty}>아직 작성한 글이 없어요.</p>}
        {myCommunityPosts.map(post => <CommunityItem key={post.id} post={post} />)}
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column' },
  profileSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: 32, paddingInline: 24, paddingBottom: 24,
  },
  avatarWrap: { marginBottom: 14 },
  avatar: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: {
    width: 96, height: 96, borderRadius: '50%',
    backgroundColor: petColors.gray100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  nickname: {
    fontSize: 20, fontWeight: 700, color: petColors.gray900,
    margin: '0 0 18px', fontFamily: 'BMJUA, sans-serif',
  },
  statsRow: { display: 'flex', alignItems: 'center', marginBottom: 24 },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 28px' },
  statNumber: { fontSize: 20, fontWeight: 700, color: petColors.gray900, fontFamily: 'BMJUA, sans-serif' },
  statLabel: { fontSize: 13, color: petColors.gray500, marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: petColors.gray200 },
  editButton: {
    padding: '10px 28px', borderRadius: 24,
    border: `1px solid ${petColors.blue}`,
    background: 'none', fontSize: 14, fontWeight: 600,
    color: petColors.gray700, cursor: 'pointer',
    fontFamily: 'BMJUA, sans-serif',
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
    borderBottom: `1px solid ${petColors.gray100}`,
    borderTop: `1px solid ${petColors.gray100}`,
  },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: petColors.gray800, fontFamily: 'BMJUA, sans-serif' },
  sectionCount: {
    fontSize: 12, padding: '2px 8px', borderRadius: 10,
    backgroundColor: petColors.surface, color: petColors.gray600,
    fontFamily: 'BMJUA, sans-serif',
  },
  feed: { display: 'flex', flexDirection: 'column' },
  item: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 16px', borderBottom: `1px solid ${petColors.gray100}`,
  },
  itemThumb: { width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  itemBody: { flex: 1, minWidth: 0 },
  itemContent: {
    fontSize: 13, color: petColors.gray600, margin: '0 0 6px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  itemMeta: { fontSize: 12, color: petColors.gray400 },
  empty: {
    textAlign: 'center', padding: 40,
    color: petColors.gray400, fontFamily: 'BMJUA, sans-serif', fontSize: 14,
  },
};
