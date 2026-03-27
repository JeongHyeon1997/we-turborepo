import { type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { petColors } from '@we/utils';
import type { FamilyMemberInfo } from '@we/utils';
import { addFamilyMember, useFamilyGroup } from '../data/familyStore';

const ACCENT = '#97A4D9';

const MEMBER_COLORS = ['#97A4D9', '#f4a0a0', '#85c1a0', '#f0b86e', '#c9a0e8', '#80c8e0'];

function memberColor(userId: string): string {
  return MEMBER_COLORS[userId.charCodeAt(userId.length - 1) % MEMBER_COLORS.length];
}

function resolveMember(code: string): FamilyMemberInfo {
  return {
    userId: code,
    nickname: '가족',
    profileImageUrl: null,
    role: 'MEMBER',
    joinedAt: new Date().toISOString(),
  };
}

function Avatar({ color, name, size = 64 }: { color: string; name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    }}>
      <span style={{ fontSize: size * 0.38, fontWeight: 700, color: '#fff', fontFamily: 'BMJUA, sans-serif' }}>
        {name[0]}
      </span>
    </div>
  );
}

export function FamilyConfirmPage() {
  const navigate      = useNavigate();
  const [params]      = useSearchParams();
  const code          = params.get('code') ?? '';
  const newMember     = resolveMember(code);
  const { group }     = useFamilyGroup();
  const existingCount = group?.members.length ?? 0;

  function handleAccept() {
    addFamilyMember(newMember);
    navigate('/my-info', { replace: true });
  }

  function handleDecline() {
    navigate(-1);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* 기존 멤버 + 새 멤버 아바타 */}
        <div style={s.avatarRow}>
          <Avatar color={ACCENT + '88'} name="나" />
          {group?.members.slice(0, 3).map(m => (
            <Avatar key={m.userId} color={memberColor(m.userId)} name={m.nickname} size={48} />
          ))}
          <span style={s.plus}>+</span>
          <Avatar color={memberColor(newMember.userId)} name={newMember.nickname} />
        </div>

        <h2 style={s.title}>
          <span style={{ color: ACCENT }}>{newMember.nickname}</span>님을<br />가족으로 추가할까요?
        </h2>
        <p style={s.sub}>
          초대 코드 <strong style={{ color: ACCENT }}>{code}</strong>로 연결 요청이 왔어요.
        </p>

        {existingCount > 0 && (
          <p style={s.memberCount}>현재 가족 {existingCount}명 → {existingCount + 1}명</p>
        )}

        <div style={s.newMemberInfo}>
          <div style={{ ...s.memberDot, backgroundColor: memberColor(newMember.userId) }} />
          <span style={s.memberName}>{newMember.nickname}</span>
        </div>

        <div style={s.btnRow}>
          <button style={s.declineBtn} onClick={handleDecline}>거절</button>
          <button style={s.acceptBtn} onClick={handleAccept}>추가 🐾</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '24px 20px', minHeight: '60vh',
  },
  card: {
    width: '100%', maxWidth: 360,
    backgroundColor: petColors.white,
    borderRadius: 24, padding: '32px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    boxShadow: `0 8px 32px ${ACCENT}30`,
    border: `1px solid ${ACCENT}33`,
  },
  avatarRow: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap', justifyContent: 'center',
  },
  plus: { fontSize: 20, color: petColors.gray400, fontWeight: 700, margin: '0 4px' },
  title: {
    margin: 0, fontSize: 20, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: petColors.gray900,
    textAlign: 'center', lineHeight: 1.4,
  },
  sub: {
    margin: 0, fontSize: 13, color: petColors.gray500,
    fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center',
  },
  memberCount: {
    margin: 0, fontSize: 13, color: petColors.gray500,
    fontFamily: 'BMJUA, sans-serif',
  },
  newMemberInfo: {
    width: '100%', padding: '12px 16px',
    backgroundColor: ACCENT + '18',
    borderRadius: 12,
    display: 'flex', alignItems: 'center', gap: 8,
  },
  memberDot: { width: 10, height: 10, borderRadius: 5 },
  memberName: {
    fontSize: 14, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: petColors.gray800,
  },
  btnRow: { display: 'flex', gap: 10, width: '100%', marginTop: 4 },
  declineBtn: {
    flex: 1, padding: '13px 0',
    borderRadius: 14, border: `1px solid ${petColors.gray200}`,
    background: petColors.white, fontSize: 15,
    fontFamily: 'BMJUA, sans-serif', color: petColors.gray500, cursor: 'pointer',
  },
  acceptBtn: {
    flex: 2, padding: '13px 0',
    borderRadius: 14, border: 'none',
    background: ACCENT,
    fontSize: 15, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: petColors.white, cursor: 'pointer',
    boxShadow: `0 4px 12px ${ACCENT}55`,
  },
};
