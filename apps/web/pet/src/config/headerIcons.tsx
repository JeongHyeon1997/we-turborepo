import { useLocation, useNavigate } from 'react-router-dom';
import { IoSettingsOutline, IoNotificationsOutline } from 'react-icons/io5';

const ANNOUNCEMENT_ROUTES = ['/my-pet', '/community', '/my-info'];

function shouldShowAnnouncements(pathname: string) {
  return ANNOUNCEMENT_ROUTES.some(r => pathname.startsWith(r));
}

export function HeaderIcons() {
  const location = useLocation();
  const navigate = useNavigate();

  const showAnnouncements = shouldShowAnnouncements(location.pathname);
  const showSettings = location.pathname.startsWith('/my-info');

  if (!showAnnouncements && !showSettings) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {showAnnouncements && (
        <button
          onClick={() => navigate('/announcements')}
          style={btnStyle}
          aria-label="공지사항"
        >
          <IoNotificationsOutline size={22} />
        </button>
      )}
      {showSettings && (
        <button
          onClick={() => navigate('/settings')}
          style={btnStyle}
          aria-label="설정"
        >
          <IoSettingsOutline size={22} />
        </button>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  color: '#374151',
};
