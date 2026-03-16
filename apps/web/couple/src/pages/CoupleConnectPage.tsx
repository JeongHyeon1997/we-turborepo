import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { coupleColors } from '@we/utils';

const MY_CODE = 'WE-7429';
const ACCENT  = '#f4a0a0';

export function CoupleConnectPage() {
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  function handleCopy() {
    navigator.clipboard?.writeText(MY_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSubmit() {
    const code = inputCode.trim().toUpperCase();
    if (!code) { setError('코드를 입력해주세요.'); return; }
    if (code === MY_CODE) { setError('내 코드는 입력할 수 없어요.'); return; }
    setError('');
    navigate(`/couple-confirm?code=${encodeURIComponent(code)}`);
  }

  return (
    <div style={s.page}>
      {/* 타이틀 */}
      <div style={s.hero}>
        <span style={s.heroEmoji}>💕</span>
        <h1 style={s.heroTitle}>상대방과 연결해주세요</h1>
        <p style={s.heroSub}>함께 일기를 작성하려면 연결이 필요합니다.</p>
      </div>

      {/* 내 초대 코드 */}
      <div style={s.section}>
        <p style={s.sectionLabel}>내 초대 코드</p>
        <div style={s.codeBox}>
          <span style={s.codeText}>{MY_CODE}</span>
          <button style={{ ...s.copyBtn, backgroundColor: copied ? coupleColors.primary200 : ACCENT + '22', color: copied ? coupleColors.gray700 : ACCENT }} onClick={handleCopy}>
            {copied ? '복사됨 ✓' : '복사'}
          </button>
        </div>
        <p style={s.codeHint}>위 코드를 상대방에게 공유하세요.</p>
      </div>

      {/* 구분선 */}
      <div style={s.divider}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>또는</span>
        <div style={s.dividerLine} />
      </div>

      {/* 코드 입력 */}
      <div style={s.section}>
        <p style={s.sectionLabel}>상대방 초대 코드 입력</p>
        <input
          style={{ ...s.input, borderColor: error ? '#ef4444' : coupleColors.gray200 }}
          placeholder="예: WE-1234"
          value={inputCode}
          onChange={e => { setInputCode(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          maxLength={10}
        />
        {error && <p style={s.errorText}>{error}</p>}
      </div>

      <button style={s.submitBtn} onClick={handleSubmit}>
        코드 확인하기 →
      </button>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex', flexDirection: 'column',
    padding: '24px 20px 40px', gap: 24,
    maxWidth: 480, margin: '0 auto',
  },
  hero: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 8, paddingTop: 16, paddingBottom: 8,
  },
  heroEmoji: { fontSize: 48 },
  heroTitle: {
    margin: 0, fontSize: 20, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray900,
  },
  heroSub: {
    margin: 0, fontSize: 14, color: coupleColors.gray500,
    fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center',
  },
  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  sectionLabel: {
    margin: 0, fontSize: 13, fontWeight: 700,
    color: coupleColors.gray600, fontFamily: 'BMJUA, sans-serif',
  },
  codeBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 16px',
    backgroundColor: coupleColors.white,
    borderRadius: 14, border: `1px solid ${coupleColors.gray100}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  codeText: {
    flex: 1, fontSize: 22, fontWeight: 700, letterSpacing: 2,
    fontFamily: 'BMJUA, sans-serif', color: ACCENT,
  },
  copyBtn: {
    padding: '6px 14px', borderRadius: 10,
    border: 'none', fontSize: 13,
    fontFamily: 'BMJUA, sans-serif', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  codeHint: {
    margin: 0, fontSize: 12, color: coupleColors.gray400,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: coupleColors.gray100 },
  dividerText: { fontSize: 12, color: coupleColors.gray400 },
  input: {
    padding: '14px 16px', fontSize: 16,
    fontFamily: 'BMJUA, sans-serif',
    borderRadius: 14, border: `1px solid ${coupleColors.gray200}`,
    outline: 'none', letterSpacing: 1,
    backgroundColor: coupleColors.white,
  },
  errorText: {
    margin: 0, fontSize: 12, color: '#ef4444',
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  submitBtn: {
    padding: '16px', borderRadius: 16,
    border: 'none', backgroundColor: ACCENT,
    fontSize: 16, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: coupleColors.white,
    cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}55`,
    marginTop: 8,
  },
};
