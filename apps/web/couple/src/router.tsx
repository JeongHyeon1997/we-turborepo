import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@we/ui-web';
import { tabs } from './config/tabs';
import { theme } from './config/theme';
import { HeaderIcons } from './config/headerIcons';
import { DiaryPage } from './pages/DiaryPage';
import { CommunityPage } from './pages/CommunityPage';
import { CommunityDetailPage } from './pages/CommunityDetailPage';
import { MyInfoPage } from './pages/MyInfoPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const coupleLogoUrl = new URL('../../../../packages/assets/couple_logo.png', import.meta.url).href;

const logo = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <img src={coupleLogoUrl} alt="" width={28} height={28} />
    <span style={{ fontWeight: 700, fontSize: 16 }}>우리, 커플</span>
  </div>
);

const stackRoutes = {
  '/settings': '설정',
  '/community/*': '커뮤니티',
  '/profile/*': '프로필',
};

export const router = createBrowserRouter(
  [
    {
      element: (
        <AppLayout
          logo={logo}
          headerIcons={<HeaderIcons />}
          tabs={tabs}
          theme={theme}
          stackRoutes={stackRoutes}
        />
      ),
      children: [
        { index: true, element: <Navigate to="/diary" replace /> },
        { path: 'diary',     element: <DiaryPage /> },
        { path: 'community', element: <CommunityPage /> },
        { path: 'community/:id', element: <CommunityDetailPage /> },
        { path: 'my-info',   element: <MyInfoPage /> },
        { path: 'profile/:name', element: <UserProfilePage /> },
        { path: 'settings',  element: <SettingsPage /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);
