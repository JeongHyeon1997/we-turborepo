import type { ReactNode, CSSProperties } from 'react';
import type { AppTheme } from '@we/utils';

interface HeaderProps {
  logo: ReactNode;
  icons?: ReactNode;
  theme: AppTheme;
}

export function Header({ logo, icons, theme }: HeaderProps) {
  const style: CSSProperties = {
    ...styles.header,
    backgroundColor: theme.headerBg,
    borderBottomColor: theme.headerBorder,
  };

  return (
    <header style={style}>
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
};
