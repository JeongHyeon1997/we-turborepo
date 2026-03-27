import { useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { coupleColors } from '@we/utils';
import { confirmCouple } from '../api/couple.api';
import { setConnection } from '../data/coupleStore';

const ACCENT        = '#f4a0a0';
const PARTNER_COLOR = '#FF6B9D';

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
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const code           = params.get('code') ?? '';
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleAccept() {
    setLoading(true);
    setError('');
    try {
      const res = await confirmCouple({ inviteCode: code });
      setConnection(res.data);
      navigate('/my-info', { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '연결에 실패했어요. 코드를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  function handleDecline() {
    navigate(-1);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.avatarRow}>
          <Avatar color={coupleColors.primary300} name="나" />
          <span style={s.heart}>💕</span>
          <Avatar color={PARTNER_COLOR} name="?" />
        </div>

        <h2 style={s.title}>커플 연결 확인</h2>
        <p style={s.sub}>초대 코드 <strong style={{ color: ACCENT }}>{code}</strong>로 연결하시겠어요?</p>

        {error && <p style={s.errorText}>{error}</p>}

        <div style={s.btnRow}>
          <button style={s.declineBtn} onClick={handleDecline} disabled={loading}>취소</button>
          <button style={{ ...s.acceptBtn, opacity: loading ? 0.7 : 1 }} onClick={handleAccept} disabled={loading}>
            {loading ? '연결 중...' : '수락 💕'}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', minHeight: '60vh' },
  card: { width: '100%', maxWidth: 360, backgroundColor: coupleColors.white, borderRadius: 24, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: '0 8px 32px rgba(244,160,160,0.18)', border: `1px solid ${coupleColors.primary100}` },
  avatarRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 },
  heart: { fontSize: 32 },
  title: { margin: 0, fontSize: 20, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray900, textAlign: 'center' },
  sub: { margin: 0, fontSize: 13, color: coupleColors.gray500, fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center' },
  errorText: { margin: 0, fontSize: 13, color: '#ef4444', fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center' },
  btnRow: { display: 'flex', gap: 10, width: '100%', marginTop: 4 },
  declineBtn: { flex: 1, padding: '13px 0', borderRadius: 14, border: `1px solid ${coupleColors.gray200}`, backgroundColor: coupleColors.white, fontSize: 15, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray500, cursor: 'pointer' },
  acceptBtn: { flex: 2, padding: '13px 0', borderRadius: 14, border: 'none', backgroundColor: ACCENT, fontSize: 15, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: coupleColors.white, cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}55` },
};
