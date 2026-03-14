import { coupleColors } from '@we/utils';

const mockUser = {
  nickname: '우리커플',
  profileImage: null as string | null,
  followers: 128,
  following: 64,
};

export function MyInfoPage() {
  return (
    <div style={styles.container}>
      <div style={styles.avatarWrap}>
        {mockUser.profileImage ? (
          <img src={mockUser.profileImage} alt="프로필" style={styles.avatar} />
        ) : (
          <div style={styles.avatarPlaceholder}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill={coupleColors.gray400}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}
      </div>

      <p style={styles.nickname}>{mockUser.nickname}</p>

      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{mockUser.followers}</span>
          <span style={styles.statLabel}>팔로워</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{mockUser.following}</span>
          <span style={styles.statLabel}>팔로잉</span>
        </div>
      </div>

      <button style={styles.editButton}>프로필 편집</button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 40,
    paddingInline: 24,
  },
  avatarWrap: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    backgroundColor: coupleColors.gray100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    fontSize: 20,
    fontWeight: 700,
    color: coupleColors.gray900,
    margin: '0 0 20px',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 28,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 28px',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 700,
    color: coupleColors.gray900,
  },
  statLabel: {
    fontSize: 13,
    color: coupleColors.gray500,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: coupleColors.gray200,
  },
  editButton: {
    padding: '12px 32px',
    borderRadius: 24,
    border: `1px solid ${coupleColors.primary400}`,
    background: 'none',
    fontSize: 14,
    fontWeight: 600,
    color: coupleColors.gray700,
    cursor: 'pointer',
  },
};
