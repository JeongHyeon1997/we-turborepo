import { coupleColors } from '@we/utils';

export function SettingsPage() {
  return (
    <div style={styles.container}>
      <p style={styles.empty}>설정 화면</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 80,
  },
  empty: {
    color: coupleColors.gray400,
    fontSize: 15,
  },
};
