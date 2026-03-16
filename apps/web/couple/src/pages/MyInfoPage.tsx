import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { coupleColors } from '@we/utils';
import type { CommunityPost, DiaryEntry } from '@we/utils';
import { AnnouncementBanner } from '@we/ui-web';
import { DatePickerModal } from '@we/ui-web';
import { communityPosts } from '../data/communityPosts';
import { myDiaryEntries } from '../data/diaryEntries';
import { announcements } from '../data/announcements';
import { useCoupleConnection, setConnection } from '../data/coupleStore';

const ACCENT  = '#f4a0a0';
const myName  = '우리커플';
const mockUser = { nickname: myName, profileImage: null as string | null, followers: 128, following: 64 };

type FilterType = '전체' | '커뮤니티' | '일기';
type FeedItem =
  | { kind: 'community'; data: CommunityPost }
  | { kind: 'diary';     data: DiaryEntry };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(isoDate: string) {
  const start = new Date(isoDate);
  const now   = new Date();
  start.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
}

function CommunityItem({ post }: { post: CommunityPost }) {
  return (
    <div style={s.item}>
      {post.image && <img src={post.image} alt="" style={s.itemThumb} />}
      <div style={s.itemBody}>
        <p style={s.itemContent}>{post.content}</p>
        <span style={s.itemMeta}>{formatDate(post.createdAt)} · 🤍 {post.likes}</span>
      </div>
      <span style={s.itemBadge('community')}>커뮤니티</span>
    </div>
  );
}

function DiaryItem({ entry }: { entry: DiaryEntry }) {
  return (
    <div style={s.item}>
      <div style={s.diaryIcon}>{entry.mood ?? '📖'}</div>
      <div style={s.itemBody}>
        <p style={s.itemTitle}>{entry.title}</p>
        <p style={s.itemContent}>{entry.content}</p>
        <span style={s.itemMeta}>{formatDate(entry.createdAt)}</span>
      </div>
      <span style={s.itemBadge('diary')}>일기</span>
    </div>
  );
}

// ─── 커플 연결 섹션 ────────────────────────────────────────────────────────────
function CoupleSection() {
  const navigate = useNavigate();
  const { connection } = useCoupleConnection();
  const [pickerType, setPickerType] = useState<'dating' | 'share' | null>(null);

  if (!connection) {
    return (
      <button style={s.connectCard} onClick={() => navigate('/couple-connect')}>
        <span style={s.connectEmoji}>💕</span>
        <div style={s.connectBody}>
          <span style={s.connectTitle}>상대방과 연결해주세요</span>
          <span style={s.connectSub}>함께 일기를 작성하려면 연결이 필요합니다.</span>
        </div>
        <span style={s.connectArrow}>초대코드 입력하러 가기 →</span>
      </button>
    );
  }

  const { partner, datingStartDate, shareStartDate } = connection;
  const datingDays = daysBetween(datingStartDate);

  return (
    <>
      <div style={s.coupleCard}>
        {/* 아바타 페어 */}
        <div style={s.avatarPair}>
          <div style={{ ...s.pairAvatar, backgroundColor: ACCENT + '55' }}>
            <span style={s.pairAvatarText}>나</span>
          </div>
          <span style={s.pairHeart}>💕</span>
          <div style={{ ...s.pairAvatar, backgroundColor: partner.avatarColor + '99' }}>
            <span style={s.pairAvatarText}>{partner.name[0]}</span>
          </div>
        </div>

        <p style={s.coupleTitle}>
          <span style={{ color: ACCENT }}>{partner.name}</span>님과 함께
        </p>

        {/* 연애 일수 */}
        <button style={s.infoRow} onClick={() => setPickerType('dating')}>
          <span style={s.infoEmoji}>🗓</span>
          <span style={s.infoText}>
            <strong style={{ color: ACCENT }}>{datingDays}일째</strong> 연애중
          </span>
          <span style={s.infoEdit}>날짜 변경 ✏️</span>
        </button>

        {/* 일기 공유 */}
        <button style={s.infoRow} onClick={() => setPickerType('share')}>
          <span style={s.infoEmoji}>📖</span>
          <span style={s.infoText}>
            <strong style={{ color: ACCENT }}>{formatDate(shareStartDate)}</strong>부터 일기 공유중
          </span>
          <span style={s.infoEdit}>날짜 변경 ✏️</span>
        </button>

        <button
          style={s.disconnectBtn}
          onClick={() => { if (window.confirm(`${partner.name}님과 연결을 끊을까요?`)) setConnection(null); }}
        >
          연결 끊기
        </button>
      </div>

      <DatePickerModal
        visible={pickerType === 'dating'}
        value={datingStartDate}
        title="연애 시작일"
        accentColor={ACCENT}
        onConfirm={date => { setConnection({ ...connection, datingStartDate: date }); setPickerType(null); }}
        onCancel={() => setPickerType(null)}
      />
      <DatePickerModal
        visible={pickerType === 'share'}
        value={shareStartDate}
        title="일기 공유 시작일"
        accentColor={ACCENT}
        onConfirm={date => { setConnection({ ...connection, shareStartDate: date }); setPickerType(null); }}
        onCancel={() => setPickerType(null)}
      />
    </>
  );
}

// ─── MyInfoPage ───────────────────────────────────────────────────────────────
export function MyInfoPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('전체');

  const myCommunityPosts = communityPosts.filter(p => p.author.name === myName);

  const feed: FeedItem[] = [
    ...(filter !== '일기' ? myCommunityPosts.map(p => ({ kind: 'community' as const, data: p })) : []),
    ...(filter !== '커뮤니티' ? myDiaryEntries.map(e => ({ kind: 'diary' as const, data: e })) : []),
  ].sort((a, b) => b.data.createdAt.localeCompare(a.data.createdAt));

  const filters: FilterType[] = ['전체', '커뮤니티', '일기'];

  return (
    <div style={s.page}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor={ACCENT}
        onPress={(id) => navigate(`/announcements/${id}`)}
      />

      {/* 커플 연결 섹션 */}
      <div style={{ padding: '12px 16px 0' }}>
        <CoupleSection />
      </div>

      {/* Profile header */}
      <div style={s.profileSection}>
        <div style={s.avatarWrap}>
          {mockUser.profileImage ? (
            <img src={mockUser.profileImage} alt="프로필" style={s.avatar} />
          ) : (
            <div style={s.avatarPlaceholder}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill={coupleColors.gray400}>
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
          <div style={s.dividerV} />
          <div style={s.statItem}>
            <span style={s.statNumber}>{mockUser.following}</span>
            <span style={s.statLabel}>팔로잉</span>
          </div>
        </div>
        <button style={s.editButton}>프로필 편집</button>
      </div>

      {/* Filter tabs */}
      <div style={s.filterRow}>
        {filters.map(f => (
          <button
            key={f}
            style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div style={s.feed}>
        {feed.length === 0 && <p style={s.empty}>아직 작성한 글이 없어요.</p>}
        {feed.map(item =>
          item.kind === 'community'
            ? <CommunityItem key={item.data.id} post={item.data} />
            : <DiaryItem key={item.data.id} entry={item.data} />
        )}
      </div>
    </div>
  );
}

const s: Record<string, any> = {
  page: { display: 'flex', flexDirection: 'column' } satisfies CSSProperties,

  // ── 커플 카드 ──
  connectCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
    width: '100%', padding: '16px',
    backgroundColor: coupleColors.primary50,
    border: `1.5px dashed ${ACCENT}`,
    borderRadius: 16, cursor: 'pointer', textAlign: 'left',
  } satisfies CSSProperties,
  connectEmoji: { fontSize: 28 } satisfies CSSProperties,
  connectBody: { display: 'flex', flexDirection: 'column', gap: 2 } satisfies CSSProperties,
  connectTitle: { fontSize: 15, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray800, fontWeight: 700 } satisfies CSSProperties,
  connectSub: { fontSize: 12, fontFamily: 'BMHANNAPro, sans-serif', color: coupleColors.gray500 } satisfies CSSProperties,
  connectArrow: {
    fontSize: 13, fontFamily: 'BMJUA, sans-serif', color: ACCENT,
    alignSelf: 'flex-end', marginTop: 4,
  } satisfies CSSProperties,

  coupleCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    padding: '20px 16px',
    backgroundColor: coupleColors.white,
    borderRadius: 20, border: `1px solid ${coupleColors.primary100}`,
    boxShadow: `0 4px 16px ${ACCENT}22`,
  } satisfies CSSProperties,
  avatarPair: { display: 'flex', alignItems: 'center', gap: 12 } satisfies CSSProperties,
  pairAvatar: {
    width: 52, height: 52, borderRadius: 26,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  } satisfies CSSProperties,
  pairAvatarText: { fontSize: 18, fontFamily: 'BMJUA, sans-serif', color: coupleColors.white, fontWeight: 700 } satisfies CSSProperties,
  pairHeart: { fontSize: 24 } satisfies CSSProperties,
  coupleTitle: { margin: 0, fontSize: 16, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray800 } satisfies CSSProperties,
  infoRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%', padding: '10px 14px',
    backgroundColor: coupleColors.gray50, borderRadius: 12,
    border: 'none', cursor: 'pointer', textAlign: 'left',
  } satisfies CSSProperties,
  infoEmoji: { fontSize: 18, flexShrink: 0 } satisfies CSSProperties,
  infoText: { flex: 1, fontSize: 14, fontFamily: 'BMHANNAPro, sans-serif', color: coupleColors.gray700 } satisfies CSSProperties,
  infoEdit: { fontSize: 11, color: coupleColors.gray400, flexShrink: 0 } satisfies CSSProperties,
  disconnectBtn: {
    padding: '6px 16px', borderRadius: 20,
    border: `1px solid ${coupleColors.gray200}`,
    background: 'none', fontSize: 12,
    fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray400, cursor: 'pointer',
    marginTop: 4,
  } satisfies CSSProperties,

  // ── 프로필 ──
  profileSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: 28, paddingInline: 24, paddingBottom: 20,
  } satisfies CSSProperties,
  avatarWrap: { marginBottom: 14 } satisfies CSSProperties,
  avatar: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' } satisfies CSSProperties,
  avatarPlaceholder: {
    width: 96, height: 96, borderRadius: '50%',
    backgroundColor: coupleColors.gray100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  } satisfies CSSProperties,
  nickname: { fontSize: 20, fontWeight: 700, color: coupleColors.gray900, margin: '0 0 18px', fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  statsRow: { display: 'flex', alignItems: 'center', marginBottom: 24 } satisfies CSSProperties,
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 28px' } satisfies CSSProperties,
  statNumber: { fontSize: 20, fontWeight: 700, color: coupleColors.gray900, fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  statLabel: { fontSize: 13, color: coupleColors.gray500, marginTop: 2 } satisfies CSSProperties,
  dividerV: { width: 1, height: 32, backgroundColor: coupleColors.gray200 } satisfies CSSProperties,
  editButton: {
    padding: '10px 28px', borderRadius: 24,
    border: `1px solid ${coupleColors.primary400}`,
    background: 'none', fontSize: 14, fontWeight: 600,
    color: coupleColors.gray700, cursor: 'pointer', fontFamily: 'BMJUA, sans-serif',
  } satisfies CSSProperties,

  filterRow: { display: 'flex', gap: 8, padding: '0 16px 12px', borderBottom: `1px solid ${coupleColors.gray100}` } satisfies CSSProperties,
  filterBtn: {
    padding: '7px 16px', borderRadius: 20, border: `1px solid ${coupleColors.gray200}`,
    background: 'none', fontSize: 13, cursor: 'pointer', color: coupleColors.gray500, fontFamily: 'BMJUA, sans-serif',
  } satisfies CSSProperties,
  filterBtnActive: { backgroundColor: coupleColors.primary400, borderColor: coupleColors.primary400, color: coupleColors.gray800 } satisfies CSSProperties,
  feed: { display: 'flex', flexDirection: 'column', gap: 1, padding: '8px 0' } satisfies CSSProperties,
  item: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 16px', borderBottom: `1px solid ${coupleColors.gray100}`, position: 'relative',
  } satisfies CSSProperties,
  itemThumb: { width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 } satisfies CSSProperties,
  diaryIcon: {
    width: 60, height: 60, borderRadius: 8, backgroundColor: coupleColors.primary50,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
  } satisfies CSSProperties,
  itemBody: { flex: 1, minWidth: 0 } satisfies CSSProperties,
  itemTitle: { fontSize: 14, fontWeight: 700, color: coupleColors.gray800, margin: '0 0 4px', fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  itemContent: {
    fontSize: 13, color: coupleColors.gray600, margin: '0 0 6px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'BMHANNAPro, sans-serif',
  } satisfies CSSProperties,
  itemMeta: { fontSize: 12, color: coupleColors.gray400 } satisfies CSSProperties,
  itemBadge: (kind: string) => ({
    fontSize: 11, padding: '2px 8px', borderRadius: 10, flexShrink: 0,
    backgroundColor: kind === 'community' ? coupleColors.primary100 : coupleColors.secondary200,
    color: coupleColors.gray600, fontFamily: 'BMJUA, sans-serif', alignSelf: 'flex-start',
  }) satisfies CSSProperties,
  empty: { textAlign: 'center', padding: 40, color: coupleColors.gray400, fontFamily: 'BMJUA, sans-serif', fontSize: 14 } satisfies CSSProperties,
};
