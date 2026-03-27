import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { petColors } from '@we/utils';
import { AnnouncementBanner, DatePickerModal, AuthPromptModal } from '@we/ui-web';
import { useAuth, logout } from '../data/authStore';
import { announcements } from '../data/announcements';
import { useFamilyGroup, setFamilyGroup, removeFamilyMember } from '../data/familyStore';

const ACCENT = '#97A4D9';

function daysBetween(isoDate: string) {
  const start = new Date(isoDate);
  const now   = new Date();
  start.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
}

function FamilySection() {
  const navigate = useNavigate();
  const { group } = useFamilyGroup();
  const { isLoggedIn } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [groupStartDate, setGroupStartDate] = useState('2024-01-01');

  if (!group) {
    return (
      <>
        <button
          style={fs.connectCard}
          onClick={() => isLoggedIn ? navigate('/family-connect') : setShowAuthPrompt(true)}
        >
          <span style={fs.connectEmoji}>🐾</span>
          <div style={fs.connectBody}>
            <span style={fs.connectTitle}>가족을 초대해주세요</span>
            <span style={fs.connectSub}>함께 일기를 작성하려면 가족 연결이 필요합니다.</span>
          </div>
          <span style={fs.connectArrow}>초대코드 입력하러 가기 →</span>
        </button>
        <AuthPromptModal
          visible={showAuthPrompt}
          message="가족 연결은 회원만 이용할 수 있어요"
          accentColor="#97A4D9"
          onLoginPress={() => { setShowAuthPrompt(false); navigate('/auth'); }}
          onClose={() => setShowAuthPrompt(false)}
        />
      </>
    );
  }

  return (
    <>
      <div style={fs.card}>
        {/* 아바타 행 */}
        <div style={fs.avatarRow}>
          <div style={{ ...fs.avatar, backgroundColor: ACCENT + '88' }}>
            <span style={fs.avatarText}>나</span>
          </div>
          {group.members.map(m => (
            <div key={m.userId} style={{ ...fs.avatar, backgroundColor: ACCENT + '55' }}>
              <span style={fs.avatarText}>{m.nickname[0]}</span>
            </div>
          ))}
        </div>

        {/* 함께한 날 */}
        <p style={fs.daysText}>가족과 함께한지 {daysBetween(groupStartDate)}일째 🐾</p>

        {/* 시작일 편집 */}
        <button style={fs.dateRow} onClick={() => setShowDatePicker(true)}>
          <span style={fs.dateLabel}>📅 그룹 시작일</span>
          <span style={fs.dateValue}>{groupStartDate.replace(/-/g, '.')}</span>
          <span style={fs.dateEdit}>✏️</span>
        </button>

        {/* 멤버 목록 */}
        <div style={fs.memberList}>
          {group.members.map(m => (
            <div key={m.userId} style={fs.memberRow}>
              <div style={{ ...fs.memberDot, backgroundColor: ACCENT }} />
              <span style={fs.memberName}>{m.nickname}</span>
              <button
                style={fs.removeBtn}
                onClick={() => { if (window.confirm(`${m.nickname}님을 가족에서 제거할까요?`)) removeFamilyMember(m.userId); }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 멤버 추가 + 그룹 해제 */}
        <div style={fs.actionRow}>
          <button
            style={fs.addBtn}
            onClick={() => isLoggedIn ? navigate('/family-connect') : setShowAuthPrompt(true)}
          >
            + 가족 추가
          </button>
          <button
            style={fs.leaveBtn}
            onClick={() => { if (window.confirm('가족 그룹을 해제할까요?')) setFamilyGroup(null); }}
          >
            그룹 해제
          </button>
        </div>
      </div>

      <AuthPromptModal
        visible={showAuthPrompt}
        message="가족 연결은 회원만 이용할 수 있어요"
        accentColor="#97A4D9"
        onLoginPress={() => { setShowAuthPrompt(false); navigate('/auth'); }}
        onClose={() => setShowAuthPrompt(false)}
      />

      <DatePickerModal
        visible={showDatePicker}
        value={groupStartDate}
        title="그룹 시작일 선택"
        accentColor={ACCENT}
        onConfirm={date => { setGroupStartDate(date); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
      />
    </>
  );
}



export function MyInfoPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div style={s.page}>
        <AnnouncementBanner
          announcements={announcements}
          accentColor="#97A4D9"
          onPress={(id) => navigate(`/announcements/${id}`)}
        />
        <div style={s.authPrompt}>
          <span style={s.authEmoji}>🔒</span>
          <p style={s.authTitle}>로그인이 필요해요</p>
          <p style={s.authSub}>내 정보를 보려면 로그인해주세요.</p>
          <button style={s.authButton} onClick={() => navigate('/auth')}>
            로그인 / 회원가입
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#97A4D9"
        onPress={(id) => navigate(`/announcements/${id}`)}
      />
      <div style={{ padding: '12px 16px 0' }}>
        <FamilySection />
      </div>
      {/* Profile header */}
      <div style={s.profileSection}>
        <div style={s.avatarWrap}>
          <div style={s.avatarPlaceholder}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill={petColors.gray400}>
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

      {/* Posts */}
      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>커뮤니티 글</span>
      </div>

      <div style={s.feed}>
        <p style={s.empty}>아직 작성한 글이 없어요.</p>
      </div>
    </div>
  );
}

const fs: Record<string, CSSProperties> = {
  connectCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '16px 20px', borderRadius: 16,
    border: `1.5px dashed ${ACCENT}`,
    background: ACCENT + '0d',
    gap: 6, cursor: 'pointer', width: '100%',
    fontFamily: 'inherit',
  },
  connectEmoji: { fontSize: 28 },
  connectBody: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  connectTitle: { fontSize: 15, fontWeight: 700, color: ACCENT, fontFamily: 'BMJUA, sans-serif' },
  connectSub: { fontSize: 12, color: petColors.gray500, fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center' },
  connectArrow: { fontSize: 12, color: ACCENT, fontFamily: 'BMJUA, sans-serif', marginTop: 4 },
  card: {
    padding: '20px 16px', borderRadius: 20,
    backgroundColor: petColors.white,
    border: `1px solid ${ACCENT}33`,
    boxShadow: `0 4px 20px ${ACCENT}20`,
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  avatarRow: {
    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
  },
  avatar: {
    width: 44, height: 44, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'BMJUA, sans-serif' },
  daysText: {
    margin: 0, fontSize: 18, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: ACCENT,
  },
  dateRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px', borderRadius: 12,
    background: ACCENT + '15', border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', width: '100%',
  },
  dateLabel: { flex: 1, fontSize: 13, color: petColors.gray700, fontFamily: 'BMJUA, sans-serif' },
  dateValue: { fontSize: 13, color: petColors.gray600, fontFamily: 'BMHANNAPro, sans-serif' },
  dateEdit: { fontSize: 13 },
  memberList: { display: 'flex', flexDirection: 'column', gap: 6 },
  memberRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px', borderRadius: 10,
    backgroundColor: petColors.gray50,
  },
  memberDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  memberName: { flex: 1, fontSize: 14, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: petColors.gray800 },
  removeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 12, color: petColors.gray400, padding: '2px 4px',
  },
  actionRow: { display: 'flex', gap: 8 },
  addBtn: {
    flex: 1, padding: '10px 0', borderRadius: 12,
    border: `1.5px solid ${ACCENT}`, background: 'none',
    fontSize: 14, fontWeight: 700, color: ACCENT,
    fontFamily: 'BMJUA, sans-serif', cursor: 'pointer',
  },
  leaveBtn: {
    padding: '10px 16px', borderRadius: 12,
    border: `1px solid ${petColors.gray200}`, background: 'none',
    fontSize: 13, color: petColors.gray400,
    fontFamily: 'BMJUA, sans-serif', cursor: 'pointer',
  },
};

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
  logoutButton: {
    marginTop: 8, padding: '4px 12px', borderRadius: 12,
    border: 'none', background: 'none',
    fontSize: 12, color: petColors.gray400,
    cursor: 'pointer', fontFamily: 'BMJUA, sans-serif',
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
  authPrompt: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: 12 },
  authEmoji: { fontSize: 48 },
  authTitle: { fontSize: 20, fontWeight: 700, color: petColors.gray800, margin: 0, fontFamily: 'BMJUA, sans-serif' },
  authSub: { fontSize: 14, color: petColors.gray500, margin: 0, fontFamily: 'BMHANNAPro, sans-serif' },
  authButton: { marginTop: 8, padding: '12px 32px', borderRadius: 24, backgroundColor: ACCENT, border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', cursor: 'pointer' },
};
