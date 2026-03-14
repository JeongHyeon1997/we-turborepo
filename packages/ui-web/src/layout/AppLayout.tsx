import type { ReactNode, CSSProperties } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { AppTheme } from '@we/utils';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import type { NavTab } from './BottomNav';

interface AppLayoutProps {
  logo: ReactNode;
  headerIcons?: ReactNode;
  tabs: NavTab[];
  theme: AppTheme;
  /** 스택 헤더를 사용할 라우트 → 타이틀 매핑. 예: { '/settings': '설정' } */
  stackRoutes?: Record<string, string>;
}

export function AppLayout({ logo, headerIcons, tabs, theme, stackRoutes }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const stackTitle = stackRoutes
    ? Object.entries(stackRoutes).find(([pattern]) => {
        if (pattern.endsWith('*')) {
          return location.pathname.startsWith(pattern.slice(0, -1));
        }
        return location.pathname === pattern;
      })?.[1]
    : undefined;
  const isStack = stackTitle !== undefined;

  return (
    <div style={styles.root}>
      <Header
        logo={logo}
        icons={isStack ? undefined : headerIcons}
        theme={theme}
        stackMode={isStack}
        title={stackTitle}
        onBack={() => navigate(-1)}
      />
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
    height: '100dvh',
    overflow: 'hidden',
  } satisfies CSSProperties,
  main: {
    flex: 1,
    overflowY: 'auto',
  } satisfies CSSProperties,
};
