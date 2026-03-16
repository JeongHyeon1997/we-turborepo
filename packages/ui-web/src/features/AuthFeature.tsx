import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { AuthUser } from '@we/utils';

const N = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray700: '#374151',
};

export interface AuthFeatureProps {
  onLogin: (user: AuthUser) => void;
  accentColor?: string;
}

export function AuthFeature({ onLogin, accentColor = '#f4a0a0' }: AuthFeatureProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 400,
    margin: '0 auto',
    padding: '32px 20px',
    gap: 12,
  };

  const titleStyle: CSSProperties = {
    fontFamily: 'BMJUA, sans-serif',
    fontSize: 22,
    color: '#111827',
    margin: 0,
  };

  const subStyle: CSSProperties = {
    fontFamily: 'BMHANNAPro, sans-serif',
    fontSize: 13,
    color: N.gray500,
    margin: '0 0 8px',
  };

  const btnBase: CSSProperties = {
    width: '100%',
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    fontSize: 15,
    fontFamily: 'BMJUA, sans-serif',
    cursor: 'pointer',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: `1px solid ${N.gray200}`,
    fontFamily: 'BMHANNAPro, sans-serif',
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
  };

  const dividerRow: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '4px 0',
  };

  const dividerLine: CSSProperties = {
    flex: 1,
    height: 1,
    background: N.gray200,
  };

  const dividerText: CSSProperties = {
    fontFamily: 'BMHANNAPro, sans-serif',
    fontSize: 12,
    color: N.gray400,
    whiteSpace: 'nowrap',
  };

  const separator: CSSProperties = {
    height: 1,
    background: N.gray100,
    margin: '4px 0',
  };

  return (
    <div style={container}>
      <p style={titleStyle}>로그인 / 회원가입</p>
      <p style={subStyle}>가입하면 데이터가 안전하게 백업돼요</p>

      {/* 카카오 */}
      <button
        style={{ ...btnBase, background: '#FEE500', color: '#3C1E1E' }}
        onClick={() => onLogin({ id: 'mock-kakao', name: '카카오유저', provider: 'kakao', avatarColor: accentColor })}
      >
        카카오로 계속하기
      </button>

      {/* 애플 */}
      <button
        style={{ ...btnBase, background: '#000', color: N.white }}
        onClick={() => onLogin({ id: 'mock-apple', name: '애플유저', provider: 'apple', avatarColor: accentColor })}
      >
        Apple로 계속하기
      </button>

      {/* 구글 */}
      <button
        style={{ ...btnBase, background: N.white, border: `1px solid ${N.gray200}`, color: N.gray700 }}
        onClick={() => onLogin({ id: 'mock-google', name: '구글유저', provider: 'google', avatarColor: accentColor })}
      >
        Google로 계속하기
      </button>

      {/* 또는 divider */}
      <div style={dividerRow}>
        <span style={dividerLine} />
        <span style={dividerText}>──── 또는 ────</span>
        <span style={dividerLine} />
      </div>

      {/* 이메일 입력 */}
      <input
        style={inputStyle}
        type="email"
        placeholder="이메일"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {/* 이메일 로그인 */}
      <button
        style={{ ...btnBase, background: accentColor, color: N.white }}
        onClick={() => onLogin({ id: 'mock-email', name: '이메일유저', provider: 'email', email, avatarColor: accentColor })}
      >
        이메일로 계속
      </button>

      <div style={separator} />

      {/* 개발용 빠른 로그인 */}
      <button
        style={{ ...btnBase, background: N.white, border: `1px solid ${N.gray200}`, color: N.gray500, fontSize: 13 }}
        onClick={() => onLogin({ id: 'dev-001', name: '테스트유저', avatarColor: accentColor, provider: 'email' })}
      >
        🛠 개발용 빠른 로그인
      </button>
    </div>
  );
}
