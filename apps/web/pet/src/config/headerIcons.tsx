import { useLocation, useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from 'react-icons/io5';

export function HeaderIcons() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.pathname.startsWith('/my-info')) return null;

  return (
    <button
      onClick={() => navigate('/settings')}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        color: '#374151',
      }}
    >
      <IoSettingsOutline size={22} />
    </button>
  );
}
