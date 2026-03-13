import type { ReactNode, CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
import type { AppTheme } from '@we/utils';

export interface NavTab {
  key: string;
  path: string;
  label: string;
  icon: ReactNode;
}

interface BottomNavProps {
  tabs: NavTab[];
  theme: AppTheme;
}

export function BottomNav({ tabs, theme }: BottomNavProps) {
  const navStyle: CSSProperties = {
    ...styles.nav,
    backgroundColor: theme.navBg,
    borderTopColor: theme.navBorder,
  };

  return (
    <nav style={navStyle}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.key}
          to={tab.path}
          style={({ isActive }) => ({
            ...styles.tab,
            color: isActive ? theme.navActiveColor : theme.navInactiveColor,
          })}
        >
          <span style={styles.icon}>{tab.icon}</span>
          <span style={styles.label}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    position: 'sticky',
    bottom: 0,
    zIndex: 100,
  } satisfies CSSProperties,
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: '8px 0',
    textDecoration: 'none',
  } satisfies CSSProperties,
  icon: {
    display: 'flex',
    fontSize: 22,
  } satisfies CSSProperties,
  label: {
    fontSize: 11,
  } satisfies CSSProperties,
};
