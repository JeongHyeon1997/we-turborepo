import { type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { marriageColors } from '@we/utils';
import { setConnection } from '../data/coupleStore';

const ACCENT = '#c9a96e';
const today = () => new Date().toISOString().slice(0, 10);

function resolvePartner(code: string) {
  return {
    id: code,
    name: '다솔이',
    avatarColor: '#d4a574',
  };
}

function Avatar({ color, name, size = 72 }: { color: string; name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    }}>
      <span style={{ fontSize: size * 0.4, fontWeight: 700, color: '#fff', fontFamily: 'BMJUA, sans-serif' }}>
        {name[0]}
      </span>
    </div>
  );
}

export function CoupleConfirmPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const code = params.get('code') ?? '';
  const partner = resolvePartner(code);

  function handleAccept() {
    setConnection({
      partner,
      datingStartDate: today(),
      shareStartDate: today(),
    });
    navigate('/my-info', { replace: true });
  }

  function handleDecline() {
    navigate(-1);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.avatarRow}>
          <Avatar color={marriageColors.primary300} name="나" />
          <span style={s.heart}>💍</span>
          <Avatar color={partner.avatarColor} name={partner.name} />
        </div>

        <h2 style={s.title}>{partner.name}님과 부부이신가요?</h2>
        <p style={s.sub}>초대 코드 <strong style={{ color: ACCENT }}>{code}</strong>로 연결 요청이 왔어요.</p>

        <div style={s.partnerInfo}>
          <div style={s.partnerRow}>
            <div style={{ ...s.partnerDot, backgroundColor: partner.avatarColor }} />
            <span style={s.partnerName}>{partner.name}</span>
          </div>
        </div>

        <div style={s.btnRow}>
          <button style={s.declineBtn} onClick={handleDecline}>거절</button>
          <button style={s.acceptBtn} onClick={handleAccept}>수락 💍</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', minHeight: '60vh' },
  card: {
    width: '100%', maxWidth: 360,
    backgroundColor: marriageColors.white, borderRadius: 24,
    padding: '32px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    boxShadow: `0 8px 32px ${ACCENT}2e`,
    border: `1px solid ${marriageColors.primary100}`,
  },
  avatarRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 },
  heart: { fontSize: 32 },
  title: { margin: 0, fontSize: 20, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: marriageColors.gray900, textAlign: 'center' },
  sub: { margin: 0, fontSize: 13, color: marriageColors.gray500, fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center' },
  partnerInfo: { width: '100%', padding: '12px 16px', backgroundColor: marriageColors.primary50, borderRadius: 12 },
  partnerRow: { display: 'flex', alignItems: 'center', gap: 8 },
  partnerDot: { width: 10, height: 10, borderRadius: 5 },
  partnerName: { fontSize: 14, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: marriageColors.gray800 },
  btnRow: { display: 'flex', gap: 10, width: '100%', marginTop: 4 },
  declineBtn: { flex: 1, padding: '13px 0', borderRadius: 14, border: `1px solid ${marriageColors.gray200}`, background: marriageColors.white, fontSize: 15, fontFamily: 'BMJUA, sans-serif', color: marriageColors.gray500, cursor: 'pointer' },
  acceptBtn: { flex: 2, padding: '13px 0', borderRadius: 14, border: 'none', background: ACCENT, fontSize: 15, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: marriageColors.white, cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}55` },
};
