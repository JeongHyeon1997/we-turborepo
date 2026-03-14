import type { ReactNode, CSSProperties } from 'react';
import type { AppTheme } from '@we/utils';

interface HeaderProps {
  logo: ReactNode;
  icons?: ReactNode;
  theme: AppTheme;
  stackMode?: boolean;
  title?: string;
  onBack?: () => void;
}

export function Header({ logo, icons, theme, stackMode, title, onBack }: HeaderProps) {
  const baseStyle: CSSProperties = {
    ...styles.header,
    backgroundColor: theme.headerBg,
    borderBottomColor: theme.headerBorder,
  };

  if (stackMode) {
    return (
      <header style={baseStyle}>
        <button onClick={onBack} style={styles.backBtn}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={styles.stackTitle}>{title}</span>
        <div style={{ width: 36 }} />
      </header>
    );
  }

  return (
    <header style={baseStyle}>
      <div style={styles.logo}>{logo}</div>
      {icons && <div style={styles.icons}>{icons}</div>}
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    padding: '0 16px',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  } satisfies CSSProperties,
  logo: {
    display: 'flex',
    alignItems: 'center',
  } satisfies CSSProperties,
  icons: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } satisfies CSSProperties,
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#374151',
    padding: 4,
    width: 36,
  } satisfies CSSProperties,
  stackTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: '#111827',
  } satisfies CSSProperties,
};
