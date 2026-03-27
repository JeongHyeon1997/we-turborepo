import { useEffect, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryFeature, AnnouncementBanner } from '@we/ui-web';
import type { Mood } from '@we/utils';
import { useAuth } from '../data/authStore';
import { usePets, setPets, setSelectedPetId } from '../data/petStore';
import { useDiaryEntries } from '../data/diaryRepo';
import { getPets } from '../api/pet.api';
import { announcements } from '../data/announcements';

const MOODS: Mood[] = [
  { emoji: '🎉', label: '신났어요',   color: '#FFD93D' },
  { emoji: '🥰', label: '애교부려요', color: '#FF6B9D' },
  { emoji: '😌', label: '얌전해요',   color: '#74B9FF' },
  { emoji: '😴', label: '졸려요',     color: '#A29BFE' },
  { emoji: '🍖', label: '배고파요',   color: '#FDCB6E' },
  { emoji: '🤒', label: '아파요',     color: '#8BA4B8' },
  { emoji: '🐾', label: '장난꾸러기', color: '#FD79A8' },
  { emoji: '⚡', label: '활발해요',   color: '#FF7675' },
];

const ACCENT = '#97A4D9';

export function DiaryPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { pets, selectedPetId } = usePets();
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useDiaryEntries(selectedPetId ?? undefined);

  // 로그인 후 펫 목록 로드
  useEffect(() => {
    if (!isLoggedIn) return;
    getPets()
      .then((res) => setPets(res.data))
      .catch(console.error);
  }, [isLoggedIn]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor={ACCENT}
        onPress={(id) => navigate(`/announcements/${id}`)}
      />

      {/* ── 펫 선택 탭 (로그인 시) ── */}
      {isLoggedIn && pets.length > 0 && (
        <div style={s.petTabsWrap}>
          <div style={s.petTabs}>
            {pets.map((pet) => {
              const active = pet.id === selectedPetId;
              return (
                <button
                  key={pet.id}
                  style={{ ...s.petTab, ...(active ? { borderBottomColor: ACCENT, color: ACCENT } : {}) }}
                  onClick={() => setSelectedPetId(pet.id)}
                >
                  {pet.profileImageUrl ? (
                    <img src={pet.profileImageUrl} alt={pet.name} style={s.petAvatar} />
                  ) : (
                    <div style={{ ...s.petAvatarPlaceholder, backgroundColor: active ? ACCENT + '33' : '#f0f0f0' }}>
                      🐾
                    </div>
                  )}
                  <span style={s.petTabLabel}>{pet.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}


      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <DiaryFeature
          accentColor={ACCENT}
          moods={MOODS}
          moodModalTitle={'오늘 우리 아이는\n어땠나요? 🐾'}
          entries={entries}
          loading={loading}
          onAddEntry={addEntry}
          onUpdateEntry={updateEntry}
          onDeleteEntry={deleteEntry}
        />
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  petTabsWrap: { backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', flexShrink: 0 },
  petTabs: { display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 8px' },
  petTab: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer',
    borderBottom: '2px solid transparent', color: '#9ca3af', flexShrink: 0,
  },
  petAvatar: { width: 36, height: 36, borderRadius: 18, objectFit: 'cover' },
  petAvatarPlaceholder: { width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  petTabLabel: { fontSize: 11, fontFamily: 'BMHANNAPro, sans-serif' },
  noPetWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 8 },
  noPetIcon: { fontSize: 40 },
  noPetText: { margin: 0, fontSize: 15, color: '#374151', fontFamily: 'BMJUA, sans-serif' },
  noPetSub: { margin: 0, fontSize: 13, color: '#9ca3af', fontFamily: 'BMHANNAPro, sans-serif' },
};
