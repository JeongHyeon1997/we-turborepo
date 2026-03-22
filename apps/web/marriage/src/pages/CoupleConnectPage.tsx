import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { marriageColors } from '@we/utils';

const MY_CODE = 'WE-M429';
const ACCENT = '#c9a96e';

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
      <div style={s.hero}>
        <span style={s.heroEmoji}>💍</span>
        <h1 style={s.heroTitle}>배우자와 연결해주세요</h1>
        <p style={s.heroSub}>함께 일기를 작성하려면 연결이 필요합니다.</p>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>내 초대 코드</p>
        <div style={s.codeBox}>
          <span style={s.codeText}>{MY_CODE}</span>
          <button
            style={{ ...s.copyBtn, backgroundColor: copied ? marriageColors.primary200 : ACCENT + '22', color: copied ? marriageColors.gray700 : ACCENT }}
            onClick={handleCopy}
          >
            {copied ? '복사됨 ✓' : '복사'}
          </button>
        </div>
        <p style={s.codeHint}>위 코드를 배우자에게 공유하세요.</p>
      </div>

      <div style={s.divider}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>또는</span>
        <div style={s.dividerLine} />
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>배우자 초대 코드 입력</p>
        <input
          style={{ ...s.input, borderColor: error ? '#ef4444' : marriageColors.gray200 }}
          placeholder="예: WE-M1234"
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
  page: { display: 'flex', flexDirection: 'column', padding: '24px 20px 40px', gap: 24, maxWidth: 480, margin: '0 auto' },
  hero: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 16, paddingBottom: 8 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { margin: 0, fontSize: 20, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: marriageColors.gray900 },
  heroSub: { margin: 0, fontSize: 14, color: marriageColors.gray500, fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center' },
  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  sectionLabel: { margin: 0, fontSize: 13, fontWeight: 700, color: marriageColors.gray600, fontFamily: 'BMJUA, sans-serif' },
  codeBox: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', backgroundColor: marriageColors.white, borderRadius: 14, border: `1px solid ${marriageColors.gray100}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  codeText: { flex: 1, fontSize: 22, fontWeight: 700, letterSpacing: 2, fontFamily: 'BMJUA, sans-serif', color: ACCENT },
  copyBtn: { padding: '6px 14px', borderRadius: 10, border: 'none', fontSize: 13, fontFamily: 'BMJUA, sans-serif', cursor: 'pointer', transition: 'all 0.2s' },
  codeHint: { margin: 0, fontSize: 12, color: marriageColors.gray400, fontFamily: 'BMHANNAPro, sans-serif' },
  divider: { display: 'flex', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: marriageColors.gray100 },
  dividerText: { fontSize: 12, color: marriageColors.gray400 },
  input: { padding: '14px 16px', fontSize: 16, fontFamily: 'BMJUA, sans-serif', borderRadius: 14, border: `1px solid ${marriageColors.gray200}`, outline: 'none', letterSpacing: 1, backgroundColor: marriageColors.white },
  errorText: { margin: 0, fontSize: 12, color: '#ef4444', fontFamily: 'BMHANNAPro, sans-serif' },
  submitBtn: { padding: '16px', borderRadius: 16, border: 'none', backgroundColor: ACCENT, fontSize: 16, fontWeight: 700, fontFamily: 'BMJUA, sans-serif', color: marriageColors.white, cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}55`, marginTop: 8 },
};
