import { CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { marriageColors } from '@we/utils';
import type { CommunityPostBase } from '@we/utils';
import { communityPosts } from '../data/communityPosts';
import { userProfiles } from '../data/userProfiles';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function CommunityItem({ post }: { post: CommunityPostBase }) {
  return (
    <div style={s.item}>
      {post.imageUrls?.[0] && <img src={post.imageUrls[0]} alt="" style={s.itemThumb} />}
      <div style={s.itemBody}>
        <p style={s.itemContent}>{post.content}</p>
        <span style={s.itemMeta}>{formatDate(post.createdAt)} · 🤍 {post.likeCount}</span>
      </div>
    </div>
  );
}

export function UserProfilePage() {
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name ?? '');
  const profile = userProfiles[decodedName];
  const posts = communityPosts.filter(p => p.authorNickname === decodedName);
  const avatarColor = profile?.avatarColor ?? marriageColors.gray200;

  if (!decodedName) return <p style={s.empty}>유저를 찾을 수 없어요.</p>;

  return (
    <div style={s.page}>
      <div style={s.profileSection}>
        <div style={s.avatarWrap}>
          <div style={{ ...s.avatarPlaceholder, backgroundColor: avatarColor }}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill={marriageColors.gray500}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>
        <p style={s.nickname}>{decodedName}</p>
        <div style={s.statsRow}>
          <div style={s.statItem}>
            <span style={s.statNumber}>{profile?.followers ?? '—'}</span>
            <span style={s.statLabel}>팔로워</span>
          </div>
          <div style={s.divider} />
          <div style={s.statItem}>
            <span style={s.statNumber}>{profile?.following ?? '—'}</span>
            <span style={s.statLabel}>팔로잉</span>
          </div>
        </div>
      </div>

      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>커뮤니티 글</span>
        <span style={s.sectionCount}>{posts.length}</span>
      </div>

      <div style={s.feed}>
        {posts.length === 0 && <p style={s.empty}>아직 작성한 글이 없어요.</p>}
        {posts.map(post => <CommunityItem key={post.id} post={post} />)}
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column' },
  profileSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, paddingInline: 24, paddingBottom: 24 },
  avatarWrap: { marginBottom: 14 },
  avatarPlaceholder: { width: 96, height: 96, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  nickname: { fontSize: 20, fontWeight: 700, color: marriageColors.gray900, margin: '0 0 18px', fontFamily: 'BMJUA, sans-serif' },
  statsRow: { display: 'flex', alignItems: 'center' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 28px' },
  statNumber: { fontSize: 20, fontWeight: 700, color: marriageColors.gray900, fontFamily: 'BMJUA, sans-serif' },
  statLabel: { fontSize: 13, color: marriageColors.gray500, marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: marriageColors.gray200 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${marriageColors.gray100}`, borderTop: `1px solid ${marriageColors.gray100}` },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: marriageColors.gray800, fontFamily: 'BMJUA, sans-serif' },
  sectionCount: { fontSize: 12, padding: '2px 8px', borderRadius: 10, backgroundColor: marriageColors.primary100, color: marriageColors.gray600, fontFamily: 'BMJUA, sans-serif' },
  feed: { display: 'flex', flexDirection: 'column' },
  item: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${marriageColors.gray100}` },
  itemThumb: { width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  itemBody: { flex: 1, minWidth: 0 },
  itemContent: { fontSize: 13, color: marriageColors.gray600, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'BMHANNAPro, sans-serif' },
  itemMeta: { fontSize: 12, color: marriageColors.gray400 },
  empty: { textAlign: 'center', padding: 40, color: marriageColors.gray400, fontFamily: 'BMJUA, sans-serif', fontSize: 14 },
};
