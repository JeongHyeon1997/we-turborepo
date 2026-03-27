import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { petColors } from '@we/utils';
import { useAuthStore } from '../data/authStore';
import { updateMe } from '../api/user.api';

const ACCENT = '#97A4D9';

export function ProfileEditPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [nickname, setNickname] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    try {
      await updateMe({ nickname: trimmed });
      if (user) useAuthStore.setState({ user: { ...user, name: trimmed } });
      navigate(-1);
    } catch {
      setError('저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.form}>
        {/* 프로필 아바타 */}
        <div style={s.avatarWrap}>
          <div style={s.avatar}>
            <svg width={52} height={52} viewBox="0 0 24 24" fill={petColors.gray400}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>

        {/* 닉네임 */}
        <div style={s.field}>
          <label style={s.label}>닉네임</label>
          <input
            style={s.input}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
            placeholder="닉네임을 입력하세요"
          />
          <span style={s.hint}>{nickname.length}/20</span>
        </div>

        {/* 이메일 (읽기 전용) */}
        {user?.email && (
          <div style={s.field}>
            <label style={s.label}>이메일</label>
            <div style={s.readOnly}>{user.email}</div>
          </div>
        )}

        {error && <p style={s.error}>{error}</p>}

        <button
          style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1 }}
          onClick={handleSave}
          disabled={saving || !nickname.trim()}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex', flexDirection: 'column',
    padding: '32px 24px',
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  avatarWrap: {
    display: 'flex', justifyContent: 'center', marginBottom: 8,
  },
  avatar: {
    width: 96, height: 96, borderRadius: '50%',
    backgroundColor: petColors.gray100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  field: {
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  label: {
    fontSize: 13, fontWeight: 700,
    color: petColors.gray600, fontFamily: 'BMJUA, sans-serif',
  },
  input: {
    padding: '12px 14px', borderRadius: 12,
    border: `1.5px solid ${ACCENT}55`,
    fontSize: 15, fontFamily: 'BMHANNAPro, sans-serif',
    color: petColors.gray800, outline: 'none',
    backgroundColor: petColors.white,
  },
  hint: {
    fontSize: 11, color: petColors.gray400,
    textAlign: 'right', fontFamily: 'BMHANNAPro, sans-serif',
  },
  readOnly: {
    padding: '12px 14px', borderRadius: 12,
    border: `1.5px solid ${petColors.gray100}`,
    fontSize: 15, fontFamily: 'BMHANNAPro, sans-serif',
    color: petColors.gray500,
    backgroundColor: petColors.gray50,
  },
  error: {
    fontSize: 13, color: '#e57373',
    fontFamily: 'BMHANNAPro, sans-serif', margin: 0,
  },
  saveBtn: {
    marginTop: 8, padding: '14px 0', borderRadius: 16,
    backgroundColor: ACCENT, border: 'none',
    fontSize: 16, fontWeight: 700,
    color: petColors.white, cursor: 'pointer',
    fontFamily: 'BMJUA, sans-serif',
  },
};
