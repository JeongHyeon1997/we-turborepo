import type { CSSProperties } from 'react';

const N = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray200: '#e5e7eb',
  gray500: '#6b7280',
  black20: 'rgba(0,0,0,0.45)',
};

export interface AuthPromptModalProps {
  visible: boolean;
  message?: string;
  accentColor?: string;
  onLoginPress: () => void;
  onClose: () => void;
}

export function AuthPromptModal({
  visible,
  message = '회원 전용 기능이에요',
  accentColor = '#f4a0a0',
  onLoginPress,
  onClose,
}: AuthPromptModalProps) {
  if (!visible) return null;

  const overlay: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: N.black20,
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 1000,
  };

  const sheet: CSSProperties = {
    width: '100%',
    maxWidth: 480,
    margin: '0 auto',
    background: N.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: '16px 24px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  };

  const handle: CSSProperties = {
    width: 40,
    height: 4,
    borderRadius: 2,
    background: N.gray200,
    marginBottom: 8,
  };

  const lockEmoji: CSSProperties = {
    fontSize: 48,
    lineHeight: 1,
    marginBottom: 4,
  };

  const msgText: CSSProperties = {
    fontFamily: 'BMJUA, sans-serif',
    fontSize: 18,
    color: '#111827',
    textAlign: 'center',
  };

  const subText: CSSProperties = {
    fontFamily: 'BMHANNAPro, sans-serif',
    fontSize: 13,
    color: N.gray500,
    textAlign: 'center',
    whiteSpace: 'pre-line',
    lineHeight: 1.6,
  };

  const btnPrimary: CSSProperties = {
    width: '100%',
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    background: accentColor,
    color: N.white,
    fontFamily: 'BMJUA, sans-serif',
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 8,
  };

  const btnSecondary: CSSProperties = {
    width: '100%',
    padding: '12px 0',
    borderRadius: 12,
    border: `1px solid ${N.gray200}`,
    background: N.white,
    color: N.gray500,
    fontFamily: 'BMHANNAPro, sans-serif',
    fontSize: 14,
    cursor: 'pointer',
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()}>
        <div style={handle} />
        <span style={lockEmoji}>🔐</span>
        <p style={msgText}>{message}</p>
        <p style={subText}>{'가입하면 데이터가 백업되고\n더 많은 기능을 쓸 수 있어요'}</p>
        <button style={btnPrimary} onClick={onLoginPress}>로그인 / 회원가입</button>
        <button style={btnSecondary} onClick={onClose}>나중에</button>
      </div>
    </div>
  );
}
