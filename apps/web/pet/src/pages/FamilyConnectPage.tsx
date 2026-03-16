import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { petColors } from '@we/utils';

const MY_CODE = 'PET-3821';
const ACCENT  = '#97A4D9';

export function FamilyConnectPage() {
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
    navigate(`/family-confirm?code=${encodeURIComponent(code)}`);
  }

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <span style={s.heroEmoji}>🐾</span>
        <h1 style={s.heroTitle}>가족을 초대해주세요</h1>
        <p style={s.heroSub}>함께 일기를 작성하려면 가족 연결이 필요합니다.</p>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>내 초대 코드</p>
        <div style={s.codeBox}>
          <span style={s.codeText}>{MY_CODE}</span>
          <button
            style={{ ...s.copyBtn, backgroundColor: copied ? petColors.surface : ACCENT + '22', color: copied ? petColors.gray700 : ACCENT }}
            onClick={handleCopy}
          >
            {copied ? '복사됨 ✓' : '복사'}
          </button>
        </div>
        <p style={s.codeHint}>위 코드를 가족에게 공유하세요.</p>
      </div>

      <div style={s.divider}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>또는</span>
        <div style={s.dividerLine} />
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>가족 초대 코드 입력</p>
        <input
          style={{ ...s.input, borderColor: error ? '#ef4444' : petColors.gray200 }}
          placeholder="예: PET-1234"
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
    fontFamily: 'BMJUA, sans-serif', color: petColors.gray900,
  },
  heroSub: {
    margin: 0, fontSize: 14, color: petColors.gray500,
    fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center',
  },
  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  sectionLabel: {
    margin: 0, fontSize: 13, fontWeight: 700,
    color: petColors.gray600, fontFamily: 'BMJUA, sans-serif',
  },
  codeBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 16px',
    backgroundColor: petColors.white,
    borderRadius: 14, border: `1px solid ${petColors.gray100}`,
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
    margin: 0, fontSize: 12, color: petColors.gray400,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: petColors.gray100 },
  dividerText: { fontSize: 12, color: petColors.gray400 },
  input: {
    padding: '14px 16px', fontSize: 16,
    fontFamily: 'BMJUA, sans-serif',
    borderRadius: 14, border: `1px solid ${petColors.gray200}`,
    outline: 'none', letterSpacing: 1,
    backgroundColor: petColors.white,
  },
  errorText: {
    margin: 0, fontSize: 12, color: '#ef4444',
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  submitBtn: {
    padding: '16px', borderRadius: 16,
    border: 'none', backgroundColor: ACCENT,
    fontSize: 16, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: petColors.white,
    cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}55`,
    marginTop: 8,
  },
};
