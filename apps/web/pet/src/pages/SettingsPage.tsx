import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { petColors } from '@we/utils';

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <IoArrowBack size={22} />
        </button>
        <span style={styles.title}>설정</span>
        <div style={{ width: 32 }} />
      </div>

      <div style={styles.content}>
        <p style={styles.empty}>설정 화면</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: `1px solid ${petColors.gray200}`,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: petColors.gray900,
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: 600,
    color: petColors.gray900,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: petColors.gray400,
    fontSize: 15,
  },
};
