import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { AuthUser } from '@we/utils';

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
  onLogin: (user: AuthUser) => void;
  accentColor?: string;
  appName?: string;
}

type Mode = 'login' | 'signup';

export function AuthFeature({ onLogin, accentColor = '#f4a0a0', appName }: AuthFeatureProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirm('');
  }

  function handleEmailSubmit() {
    setError('');
    if (mode === 'signup' && !name.trim()) { setError('이름을 입력해주세요'); return; }
    if (!email.includes('@') || !email.includes('.')) { setError('올바른 이메일을 입력해주세요'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return; }
    if (mode === 'signup' && password !== confirm) { setError('비밀번호가 일치하지 않아요'); return; }
    onLogin({
      id: `mock-email-${Date.now()}`,
      name: mode === 'signup' ? name.trim() : '이메일유저',
      provider: 'email',
      email,
      avatarColor: accentColor,
    });
  }

  const accentLight = accentColor + '18';
  const accentMid   = accentColor + '44';

  return (
    <div style={s.page}>
      {/* ── 상단 인사 ─────────────────────────────── */}
      <div style={s.hero}>
        <div style={{ ...s.heroIcon, backgroundColor: accentLight, borderColor: accentMid }}>
          <span style={{ fontSize: 32 }}>🤝</span>
        </div>
        <p style={s.heroTitle}>
          {appName ? `${appName}에 오신 걸 환영해요` : '안녕하세요 👋'}
        </p>
        <p style={s.heroSub}>가입하면 데이터가 안전하게 백업돼요</p>
      </div>

      {/* ── 소셜 로그인 ───────────────────────────── */}
      <div style={s.socialGroup}>
        <SocialButton
          label="카카오로 계속하기"
          bg="#FEE500"
          color="#3C1E1E"
          icon="💬"
          onClick={() => onLogin({ id: 'mock-kakao', name: '카카오유저', provider: 'kakao', avatarColor: accentColor })}
        />
        <SocialButton
          label="Apple로 계속하기"
          bg="#000"
          color={N.white}
          icon="🍎"
          onClick={() => onLogin({ id: 'mock-apple', name: '애플유저', provider: 'apple', avatarColor: accentColor })}
        />
        <SocialButton
          label="Google로 계속하기"
          bg={N.white}
          color={N.gray700}
          icon="G"
          border={N.gray200}
          onClick={() => onLogin({ id: 'mock-google', name: '구글유저', provider: 'google', avatarColor: accentColor })}
        />
      </div>

      {/* ── 구분선 ────────────────────────────────── */}
      <div style={s.dividerRow}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>또는 이메일로</span>
        <div style={s.dividerLine} />
      </div>

      {/* ── 로그인 / 회원가입 탭 ──────────────────── */}
      <div style={s.tabRow}>
        <button
          style={{ ...s.tab, ...(mode === 'login' ? { ...s.tabActive, borderBottomColor: accentColor, color: accentColor } : {}) }}
          onClick={() => switchMode('login')}
        >
          로그인
        </button>
        <button
          style={{ ...s.tab, ...(mode === 'signup' ? { ...s.tabActive, borderBottomColor: accentColor, color: accentColor } : {}) }}
          onClick={() => switchMode('signup')}
        >
          회원가입
        </button>
      </div>

      {/* ── 폼 ───────────────────────────────────── */}
      <div style={s.form}>
        {mode === 'signup' && (
          <FormField
            label="이름"
            placeholder="홍길동"
            value={name}
            onChange={setName}
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
        />
        <div>
          <label style={s.fieldLabel}>비밀번호</label>
          <div style={s.pwWrap}>
            <input
              style={{ ...s.input, paddingRight: 40 }}
              type={showPw ? 'text' : 'password'}
              placeholder="6자 이상"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleEmailSubmit(); }}
            />
            <button
              style={s.pwToggle}
              type="button"
              onClick={() => setShowPw(v => !v)}
              tabIndex={-1}
            >
              {showPw ? '🙈' : '👁'}
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
          />
        )}

        {/* 에러 메시지 */}
        {error && <p style={s.errorText}>{error}</p>}

        {/* 제출 버튼 */}
        <button
          style={{ ...s.submitBtn, backgroundColor: accentColor }}
          onClick={handleEmailSubmit}
        >
          {mode === 'login' ? '로그인' : '가입하기'}
        </button>

        {mode === 'login' && (
          <button style={s.forgotBtn}>비밀번호를 잊으셨나요?</button>
        )}
      </div>

      {/* ── 개발용 ────────────────────────────────── */}
      <div style={s.devSection}>
        <div style={s.devDivider} />
        <button
          style={s.devBtn}
          onClick={() => onLogin({ id: 'dev-001', name: '테스트유저', avatarColor: accentColor, provider: 'email' })}
        >
          🛠 개발용 빠른 로그인
        </button>
      </div>
    </div>
  );
}

/* ─── 서브 컴포넌트 ───────────────────────────────────────── */

function SocialButton({
  label, bg, color, icon, border, onClick,
}: {
  label: string; bg: string; color: string; icon: string; border?: string; onClick: () => void;
}) {
  return (
    <button
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: '13px 0', borderRadius: 12,
        background: bg, color, cursor: 'pointer',
        border: border ? `1px solid ${border}` : 'none',
        fontSize: 15, fontFamily: 'BMJUA, sans-serif',
        transition: 'opacity 0.15s',
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
      {label}
    </button>
  );
}

function FormField({
  label, placeholder, type = 'text', value, onChange, accentColor,
}: {
  label: string; placeholder?: string; type?: string;
  value: string; onChange: (v: string) => void; accentColor: string;
}) {
  return (
    <div>
      <label style={s.fieldLabel}>{label}</label>
      <input
        style={s.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { e.currentTarget.style.borderColor = accentColor; }}
        onBlur={e => { e.currentTarget.style.borderColor = N.gray200; }}
      />
    </div>
  );
}

/* ─── 스타일 ──────────────────────────────────────────────── */

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex', flexDirection: 'column',
    maxWidth: 420, margin: '0 auto',
    padding: '24px 20px 40px',
    gap: 0,
  },
  hero: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', paddingBottom: 28,
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
  socialGroup: { display: 'flex', flexDirection: 'column', gap: 10 },
  dividerRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    margin: '20px 0',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: N.gray200 },
  dividerText: {
    fontSize: 12, color: N.gray400, whiteSpace: 'nowrap',
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  tabRow: {
    display: 'flex', borderBottom: `2px solid ${N.gray100}`,
    marginBottom: 20,
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
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
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
  },
  pwWrap: { position: 'relative' },
  pwToggle: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, padding: '0 2px',
  },
  errorText: {
    margin: 0, fontSize: 12, color: N.red,
    fontFamily: 'BMHANNAPro, sans-serif',
    padding: '8px 12px', borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  submitBtn: {
    width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
    fontSize: 16, fontFamily: 'BMJUA, sans-serif',
    color: N.white, cursor: 'pointer', marginTop: 4,
  },
  forgotBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 12, color: N.gray400, fontFamily: 'BMHANNAPro, sans-serif',
    textAlign: 'center', textDecoration: 'underline',
  },
  devSection: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 },
  devDivider: { height: 1, backgroundColor: N.gray100 },
  devBtn: {
    background: 'none', border: `1px dashed ${N.gray200}`,
    borderRadius: 10, padding: '11px 0', cursor: 'pointer',
    fontSize: 13, color: N.gray400, fontFamily: 'BMHANNAPro, sans-serif',
  },
};
