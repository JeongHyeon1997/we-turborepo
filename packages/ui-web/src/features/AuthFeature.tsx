import { useState } from 'react';
import type { CSSProperties } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

const N = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  red: '#ef4444',
};

export interface AuthFeatureProps {
  /** 이메일 로그인 — 실패 시 Error throw */
  onEmailLogin: (email: string, password: string) => Promise<void>;
  /** 이메일 회원가입 — 실패 시 Error throw */
  onEmailSignup: (nickname: string, email: string, password: string) => Promise<void>;
  accentColor?: string;
  appName?: string;
}

type Mode = 'login' | 'signup';

export function AuthFeature({ onEmailLogin, onEmailSignup, accentColor = '#f4a0a0', appName }: AuthFeatureProps) {
  const [mode,     setMode]     = useState<Mode>('login');
  const [nickname, setNickname] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setNickname('');
    setEmail('');
    setPassword('');
    setConfirm('');
  }

  async function handleSubmit() {
    setError('');
    if (mode === 'signup' && !nickname.trim()) { setError('닉네임을 입력해주세요'); return; }
    if (!email.includes('@') || !email.includes('.')) { setError('올바른 이메일을 입력해주세요'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return; }
    if (mode === 'signup' && password !== confirm) { setError('비밀번호가 일치하지 않아요'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await onEmailLogin(email, password);
      } else {
        await onEmailSignup(nickname.trim(), email, password);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? '오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  const accentLight = accentColor + '18';
  const accentMid   = accentColor + '44';

  return (
    <div style={s.page}>
      {/* ── 상단 ───────────────────────────────────── */}
      <div style={s.hero}>
        <div style={{ ...s.heroIcon, backgroundColor: accentLight, borderColor: accentMid }}>
          <span style={{ fontSize: 32 }}>🤝</span>
        </div>
        <p style={s.heroTitle}>
          {appName ? `${appName}에 오신 걸 환영해요` : '안녕하세요 👋'}
        </p>
        <p style={s.heroSub}>가입하면 데이터가 안전하게 백업돼요</p>
      </div>

      {/* ── 로그인 / 회원가입 탭 ──────────────────── */}
      <div style={s.tabRow}>
        {(['login', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            style={{ ...s.tab, ...(mode === m ? { ...s.tabActive, borderBottomColor: accentColor, color: accentColor } : {}) }}
            onClick={() => switchMode(m)}
          >
            {m === 'login' ? '로그인' : '회원가입'}
          </button>
        ))}
      </div>

      {/* ── 폼 ───────────────────────────────────── */}
      <div style={s.form}>
        {mode === 'signup' && (
          <FormField
            label="닉네임"
            placeholder="홍길동"
            value={nickname}
            onChange={setNickname}
            accentColor={accentColor}
          />
        )}
        <FormField
          label="이메일"
          placeholder="hello@example.com"
          type="email"
          value={email}
          onChange={setEmail}
          accentColor={accentColor}
          onEnter={handleSubmit}
        />
        <div>
          <label style={s.fieldLabel}>비밀번호</label>
          <div style={s.pwWrap}>
            <input
              style={{ ...s.input, paddingRight: 44, ...(!showPw && { fontFamily: 'system-ui, sans-serif' }) }}
              type={showPw ? 'text' : 'password'}
              placeholder="6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            />
            <button style={s.pwToggle} type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1}>
              {showPw ? <IoEyeOff size={18} color={N.gray400} /> : <IoEye size={18} color={N.gray400} />}
            </button>
          </div>
        </div>
        {mode === 'signup' && (
          <FormField
            label="비밀번호 확인"
            placeholder="다시 한번 입력"
            type={showPw ? 'text' : 'password'}
            value={confirm}
            onChange={setConfirm}
            accentColor={accentColor}
            onEnter={handleSubmit}
          />
        )}

        {error && <p style={s.errorText}>{error}</p>}

        <button
          style={{ ...s.submitBtn, backgroundColor: accentColor, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '잠시만요...' : mode === 'login' ? '로그인' : '가입하기'}
        </button>
      </div>
    </div>
  );
}

/* ─── 서브 컴포넌트 ───────────────────────────────────────── */

function FormField({
  label, placeholder, type = 'text', value, onChange, accentColor, onEnter,
}: {
  label: string; placeholder?: string; type?: string;
  value: string; onChange: (v: string) => void; accentColor: string;
  onEnter?: () => void;
}) {
  return (
    <div>
      <label style={s.fieldLabel}>{label}</label>
      <input
        style={{ ...s.input, ...(type === 'password' && { fontFamily: 'system-ui, sans-serif' }) }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = N.gray200; }}
        onKeyDown={(e) => { if (e.key === 'Enter') onEnter?.(); }}
      />
    </div>
  );
}

/* ─── 스타일 ──────────────────────────────────────────────── */

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex', flexDirection: 'column',
    maxWidth: 420, margin: '0 auto',
    padding: '32px 20px 40px',
  },
  hero: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', paddingBottom: 32,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid', marginBottom: 14,
  },
  heroTitle: {
    fontSize: 20, fontWeight: 700, margin: '0 0 6px',
    fontFamily: 'BMJUA, sans-serif', color: N.gray900,
  },
  heroSub: {
    fontSize: 13, color: N.gray400, margin: 0,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  tabRow: {
    display: 'flex', borderBottom: `2px solid ${N.gray100}`,
    marginBottom: 24,
  },
  tab: {
    flex: 1, padding: '10px 0',
    background: 'none', border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: 15, fontFamily: 'BMJUA, sans-serif',
    color: N.gray400, cursor: 'pointer',
    marginBottom: -2, transition: 'color 0.15s, border-color 0.15s',
  },
  tabActive: { fontWeight: 700 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  fieldLabel: {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: N.gray500, marginBottom: 6,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  input: {
    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
    borderRadius: 10, border: `1px solid ${N.gray200}`,
    fontSize: 14, fontFamily: 'BMHANNAPro, sans-serif',
    outline: 'none', transition: 'border-color 0.15s',
    backgroundColor: N.white, color: N.gray800,
    // 브라우저 자동완성이 글자색을 덮어쓰는 현상 방지
    WebkitTextFillColor: N.gray800,
    WebkitBoxShadow: `0 0 0 1000px ${N.white} inset`,
  },
  pwWrap: { position: 'relative' },
  pwToggle: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, padding: '0 2px',
  },
  errorText: {
    margin: 0, fontSize: 13, color: N.red,
    fontFamily: 'BMHANNAPro, sans-serif',
    padding: '10px 14px', borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  submitBtn: {
    width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
    fontSize: 16, fontFamily: 'BMJUA, sans-serif',
    color: N.white, cursor: 'pointer', marginTop: 4,
    transition: 'opacity 0.15s',
  },
};
