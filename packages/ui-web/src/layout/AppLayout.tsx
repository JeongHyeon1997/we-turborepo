import type { ReactNode, CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import type { AppTheme } from '@we/utils';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import type { NavTab } from './BottomNav';

interface AppLayoutProps {
  logo: ReactNode;
  headerIcons?: ReactNode;
  tabs: NavTab[];
  theme: AppTheme;
}

export function AppLayout({ logo, headerIcons, tabs, theme }: AppLayoutProps) {
  return (
    <div style={styles.root}>
      <Header logo={logo} icons={headerIcons} theme={theme} />
      <main style={{ ...styles.main, backgroundColor: theme.contentBg }}>
        <Outlet />
      </main>
      <BottomNav tabs={tabs} theme={theme} />
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
  } satisfies CSSProperties,
  main: {
    flex: 1,
    overflowY: 'auto',
  } satisfies CSSProperties,
};
