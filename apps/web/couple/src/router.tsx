import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@we/ui-web';
import { tabs } from './config/tabs';
import { theme } from './config/theme';
import { HeaderIcons } from './config/headerIcons';
import { DiaryPage } from './pages/DiaryPage';
import { CommunityPage } from './pages/CommunityPage';
import { MyInfoPage } from './pages/MyInfoPage';

const logo = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <img src="/icon.png" alt="" width={28} height={28} />
    <span style={{ fontWeight: 700, fontSize: 16 }}>우리, 커플</span>
  </div>
);

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout logo={logo} headerIcons={<HeaderIcons />} tabs={tabs} theme={theme} />,
      children: [
        { index: true, element: <Navigate to="/diary" replace /> },
        { path: 'diary',     element: <DiaryPage /> },
        { path: 'community', element: <CommunityPage /> },
        { path: 'my-info',   element: <MyInfoPage /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);
