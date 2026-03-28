import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { marriageColors } from '@we/utils';
import type { CommunityPostBase, DiaryEntry } from '@we/utils';
import { AnnouncementBanner, AuthPromptModal, DatePickerModal } from '@we/ui-web';
import { useAuth, logout } from '../data/authStore';
import { announcements } from '../data/announcements';
import { useCoupleConnectionResponse, setConnection } from '../data/coupleStore';
import { useDiaryEntries } from '../data/diaryStore';

const ACCENT = '#c9a96e';

type FilterType = '전체' | '커뮤니티' | '일기';
type FeedItem =
  | { kind: 'community'; data: CommunityPostBase }
  | { kind: 'diary'; data: DiaryEntry };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(isoDate: string) {
  const start = new Date(isoDate);
  const now = new Date();
  start.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
}

function CommunityItem({ post }: { post: CommunityPostBase }) {
  return (
    <div style={s.item}>
      {post.imageUrls?.[0] && <img src={post.imageUrls[0]} alt="" style={s.itemThumb} />}
      <div style={s.itemBody}>
        <p style={s.itemContent}>{post.content}</p>
        <span style={s.itemMeta}>{formatDate(post.createdAt)} · 🤍 {post.likeCount}</span>
      </div>
      <span style={s.itemBadge('community')}>커뮤니티</span>
    </div>
  );
}

function DiaryItem({ entry }: { entry: DiaryEntry }) {
  return (
    <div style={s.item}>
      <div style={s.diaryIcon}>{entry.mood ?? '💍'}</div>
      <div style={s.itemBody}>
        <p style={s.itemTitle}>{entry.title}</p>
        <p style={s.itemContent}>{entry.content}</p>
        <span style={s.itemMeta}>{formatDate(entry.createdAt)}</span>
      </div>
      <span style={s.itemBadge('diary')}>일기</span>
    </div>
  );
}

function SpouseSection() {
  const navigate = useNavigate();
  const { connection } = useCoupleConnectionResponse();
  const { isLoggedIn } = useAuth();
  const [pickerType, setPickerType] = useState<'wedding' | 'share' | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  if (!connection) {
    return (
      <>
        <button
          style={s.connectCard}
          onClick={() => isLoggedIn ? navigate('/couple-connect') : setShowAuthPrompt(true)}
        >
          <span style={s.connectEmoji}>💍</span>
          <div style={s.connectBody}>
            <span style={s.connectTitle}>배우자와 연결해주세요</span>
            <span style={s.connectSub}>함께 일기를 작성하려면 연결이 필요합니다.</span>
          </div>
          <span style={s.connectArrow}>초대코드 입력하러 가기 →</span>
        </button>
        <AuthPromptModal
          visible={showAuthPrompt}
          message="배우자 연결은 회원만 이용할 수 있어요"
          accentColor={ACCENT}
          onLoginPress={() => { setShowAuthPrompt(false); navigate('/auth', { state: { from: '/couple-connect' } }); }}
          onClose={() => setShowAuthPrompt(false)}
        />
      </>
    );
  }

  const { partner, weddingDate, shareStartDate } = connection;
  const weddingDays = weddingDate ? daysBetween(weddingDate) : 1;

  return (
    <>
      <div style={s.coupleCard}>
        <div style={s.avatarPair}>
          <div style={{ ...s.pairAvatar, backgroundColor: ACCENT + '55' }}>
            <span style={s.pairAvatarText}>나</span>
          </div>
          <span style={s.pairHeart}>💍</span>
          <div style={{ ...s.pairAvatar, backgroundColor: ACCENT + '99' }}>
            <span style={s.pairAvatarText}>{partner.nickname[0]}</span>
          </div>
        </div>

        <p style={s.coupleTitle}>
          <span style={{ color: ACCENT }}>{partner.nickname}</span>님과 함께
        </p>

        <button style={s.infoRow} onClick={() => setPickerType('wedding')}>
          <span style={s.infoEmoji}>🗓</span>
          <span style={s.infoText}>
            결혼 <strong style={{ color: ACCENT }}>{weddingDays}일째</strong> 💍
          </span>
          <span style={s.infoEdit}>날짜 변경 ✏️</span>
        </button>

        <button style={s.infoRow} onClick={() => setPickerType('share')}>
          <span style={s.infoEmoji}>📖</span>
          <span style={s.infoText}>
            <strong style={{ color: ACCENT }}>{shareStartDate ? formatDate(shareStartDate) : '-'}</strong>부터 일기 공유중
          </span>
          <span style={s.infoEdit}>날짜 변경 ✏️</span>
        </button>

        <button
          style={s.disconnectBtn}
          onClick={() => { if (window.confirm(`${partner.nickname}님과 연결을 끊을까요?`)) setConnection(null); }}
        >
          연결 끊기
        </button>
      </div>

      <DatePickerModal
        visible={pickerType === 'wedding'}
        value={weddingDate ?? ''}
        title="결혼 기념일"
        accentColor={ACCENT}
        onConfirm={date => { setConnection({ ...connection, weddingDate: date }); setPickerType(null); }}
        onCancel={() => setPickerType(null)}
      />
      <DatePickerModal
        visible={pickerType === 'share'}
        value={shareStartDate ?? ''}
        title="일기 공유 시작일"
        accentColor={ACCENT}
        onConfirm={date => { setConnection({ ...connection, shareStartDate: date }); setPickerType(null); }}
        onCancel={() => setPickerType(null)}
      />
    </>
  );
}

export function MyInfoPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [filter, setFilter] = useState<FilterType>('전체');
  const { entries: diaryEntries } = useDiaryEntries();

  if (!isLoggedIn) {
    return (
      <div style={s.page}>
        <AnnouncementBanner
          announcements={announcements}
          accentColor={ACCENT}
          onPress={(id) => navigate(`/announcements/${id}`)}
        />
        <div style={s.authPrompt}>
          <span style={s.authEmoji}>🔒</span>
          <p style={s.authTitle}>로그인이 필요해요</p>
          <p style={s.authSub}>내 정보를 보려면 로그인해주세요.</p>
          <button style={s.authButton} onClick={() => navigate('/auth', { state: { from: '/my-info' } })}>
            로그인 / 회원가입
          </button>
        </div>
      </div>
    );
  }

  const feed: FeedItem[] = [
    ...(filter !== '일기' ? ([] as CommunityPostBase[]).map(p => ({ kind: 'community' as const, data: p })) : []),
    ...(filter !== '커뮤니티' ? diaryEntries.map(e => ({ kind: 'diary' as const, data: e })) : []),
  ].sort((a, b) => b.data.createdAt.localeCompare(a.data.createdAt));

  const filters: FilterType[] = ['전체', '커뮤니티', '일기'];

  return (
    <div style={s.page}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor={ACCENT}
        onPress={(id) => navigate(`/announcements/${id}`)}
      />

      <div style={{ padding: '12px 16px 0' }}>
        <SpouseSection />
      </div>

      <div style={s.profileSection}>
        <div style={s.avatarWrap}>
          <div style={s.avatarPlaceholder}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill={marriageColors.gray400}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>
        <p style={s.nickname}>{user!.name}</p>
        <button style={s.editButton} onClick={() => navigate('/profile-edit')}>
          프로필 편집
        </button>
        <button
          style={s.logoutButton}
          onClick={() => { if (window.confirm('로그아웃 하시겠어요?')) logout(); }}
        >
          로그아웃
        </button>
      </div>

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

  connectCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
    width: '100%', padding: '16px',
    backgroundColor: marriageColors.primary50,
    border: `1.5px dashed ${ACCENT}`,
    borderRadius: 16, cursor: 'pointer', textAlign: 'left',
  } satisfies CSSProperties,
  connectEmoji: { fontSize: 28 } satisfies CSSProperties,
  connectBody: { display: 'flex', flexDirection: 'column', gap: 2 } satisfies CSSProperties,
  connectTitle: { fontSize: 15, fontFamily: 'BMJUA, sans-serif', color: marriageColors.gray800, fontWeight: 700 } satisfies CSSProperties,
  connectSub: { fontSize: 12, fontFamily: 'BMHANNAPro, sans-serif', color: marriageColors.gray500 } satisfies CSSProperties,
  connectArrow: { fontSize: 13, fontFamily: 'BMJUA, sans-serif', color: ACCENT, alignSelf: 'flex-end', marginTop: 4 } satisfies CSSProperties,

  coupleCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    padding: '20px 16px',
    backgroundColor: marriageColors.white,
    borderRadius: 20, border: `1px solid ${marriageColors.primary100}`,
    boxShadow: `0 4px 16px ${ACCENT}22`,
  } satisfies CSSProperties,
  avatarPair: { display: 'flex', alignItems: 'center', gap: 12 } satisfies CSSProperties,
  pairAvatar: { width: 52, height: 52, borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' } satisfies CSSProperties,
  pairAvatarText: { fontSize: 18, fontFamily: 'BMJUA, sans-serif', color: marriageColors.white, fontWeight: 700 } satisfies CSSProperties,
  pairHeart: { fontSize: 24 } satisfies CSSProperties,
  coupleTitle: { margin: 0, fontSize: 16, fontFamily: 'BMJUA, sans-serif', color: marriageColors.gray800 } satisfies CSSProperties,
  infoRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%', padding: '10px 14px',
    backgroundColor: marriageColors.gray50, borderRadius: 12,
    border: 'none', cursor: 'pointer', textAlign: 'left',
  } satisfies CSSProperties,
  infoEmoji: { fontSize: 18, flexShrink: 0 } satisfies CSSProperties,
  infoText: { flex: 1, fontSize: 14, fontFamily: 'BMHANNAPro, sans-serif', color: marriageColors.gray700 } satisfies CSSProperties,
  infoEdit: { fontSize: 11, color: marriageColors.gray400, flexShrink: 0 } satisfies CSSProperties,
  disconnectBtn: {
    padding: '6px 16px', borderRadius: 20,
    border: `1px solid ${marriageColors.gray200}`,
    background: 'none', fontSize: 12,
    fontFamily: 'BMJUA, sans-serif', color: marriageColors.gray400, cursor: 'pointer',
    marginTop: 4,
  } satisfies CSSProperties,

  profileSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28, paddingInline: 24, paddingBottom: 20 } satisfies CSSProperties,
  avatarWrap: { marginBottom: 14 } satisfies CSSProperties,
  avatar: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' } satisfies CSSProperties,
  avatarPlaceholder: { width: 96, height: 96, borderRadius: '50%', backgroundColor: marriageColors.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' } satisfies CSSProperties,
  nickname: { fontSize: 20, fontWeight: 700, color: marriageColors.gray900, margin: '0 0 18px', fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  statsRow: { display: 'flex', alignItems: 'center', marginBottom: 24 } satisfies CSSProperties,
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 28px' } satisfies CSSProperties,
  statNumber: { fontSize: 20, fontWeight: 700, color: marriageColors.gray900, fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  statLabel: { fontSize: 13, color: marriageColors.gray500, marginTop: 2 } satisfies CSSProperties,
  dividerV: { width: 1, height: 32, backgroundColor: marriageColors.gray200 } satisfies CSSProperties,
  editButton: { padding: '10px 28px', borderRadius: 24, border: `1px solid ${marriageColors.primary400}`, background: 'none', fontSize: 14, fontWeight: 600, color: marriageColors.gray700, cursor: 'pointer', fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  logoutButton: { marginTop: 8, padding: '4px 12px', borderRadius: 12, border: 'none', background: 'none', fontSize: 12, color: marriageColors.gray400, cursor: 'pointer', fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,

  filterRow: { display: 'flex', gap: 8, padding: '0 16px 12px', borderBottom: `1px solid ${marriageColors.gray100}` } satisfies CSSProperties,
  filterBtn: { padding: '7px 16px', borderRadius: 20, border: `1px solid ${marriageColors.gray200}`, background: 'none', fontSize: 13, cursor: 'pointer', color: marriageColors.gray500, fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  filterBtnActive: { backgroundColor: marriageColors.primary400, borderColor: marriageColors.primary400, color: marriageColors.gray800 } satisfies CSSProperties,
  feed: { display: 'flex', flexDirection: 'column', gap: 1, padding: '8px 0' } satisfies CSSProperties,
  item: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${marriageColors.gray100}`, position: 'relative' } satisfies CSSProperties,
  itemThumb: { width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 } satisfies CSSProperties,
  diaryIcon: { width: 60, height: 60, borderRadius: 8, backgroundColor: marriageColors.primary50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 } satisfies CSSProperties,
  itemBody: { flex: 1, minWidth: 0 } satisfies CSSProperties,
  itemTitle: { fontSize: 14, fontWeight: 700, color: marriageColors.gray800, margin: '0 0 4px', fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  itemContent: { fontSize: 13, color: marriageColors.gray600, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'BMHANNAPro, sans-serif' } satisfies CSSProperties,
  itemMeta: { fontSize: 12, color: marriageColors.gray400 } satisfies CSSProperties,
  itemBadge: (kind: string) => ({
    fontSize: 11, padding: '2px 8px', borderRadius: 10, flexShrink: 0,
    backgroundColor: kind === 'community' ? marriageColors.primary100 : marriageColors.secondary200,
    color: marriageColors.gray600, fontFamily: 'BMJUA, sans-serif', alignSelf: 'flex-start',
  }) satisfies CSSProperties,
  empty: { textAlign: 'center', padding: 40, color: marriageColors.gray400, fontFamily: 'BMJUA, sans-serif', fontSize: 14 } satisfies CSSProperties,
  authPrompt: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: 12 } satisfies CSSProperties,
  authEmoji: { fontSize: 48 } satisfies CSSProperties,
  authTitle: { fontSize: 20, fontWeight: 700, color: marriageColors.gray800, margin: 0, fontFamily: 'BMJUA, sans-serif' } satisfies CSSProperties,
  authSub: { fontSize: 14, color: marriageColors.gray500, margin: 0, fontFamily: 'BMHANNAPro, sans-serif' } satisfies CSSProperties,
  authButton: { marginTop: 8, padding: '12px 32px', borderRadius: 24, backgroundColor: ACCENT, border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', cursor: 'pointer' } satisfies CSSProperties,
};
