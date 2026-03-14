import { useState, type CSSProperties } from 'react';
import { IoClose } from 'react-icons/io5';
import { coupleColors } from '@we/utils';
import type { DiaryEntry } from '@we/utils';
import { myDiaryEntries } from '../data/diaryEntries';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function GalleryPage() {
  const [selected, setSelected] = useState<DiaryEntry | null>(null);
  const withImages = myDiaryEntries.filter(e => !!e.image);

  if (withImages.length === 0) {
    return (
      <div style={s.empty}>
        <span style={s.emptyIcon}>🖼️</span>
        <p style={s.emptyTitle}>아직 사진이 없어요</p>
        <p style={s.emptyDesc}>일기에 사진을 첨부하면<br />여기에 모아볼 수 있어요</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.grid}>
        {withImages.map(entry => (
          <div
            key={entry.id}
            style={s.cell}
            onClick={() => setSelected(entry)}
          >
            <img src={entry.image!} alt="" style={s.cellImg} />
          </div>
        ))}
      </div>

      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.photoModal} onClick={e => e.stopPropagation()}>
            {selected.moodColor && (
              <div style={{ height: 5, backgroundColor: selected.moodColor, flexShrink: 0 }} />
            )}
            <div style={s.photoHeader}>
              <div>
                <span style={s.photoDate}>{formatDate(selected.createdAt)}</span>
                <p style={s.photoTitle}>{selected.title}</p>
              </div>
              <button style={s.closeBtn} onClick={() => setSelected(null)}>
                <IoClose size={22} color={coupleColors.gray400} />
              </button>
            </div>
            <img src={selected.image!} alt="" style={s.photoFull} />
            {selected.content && (
              <div style={s.photoBody}>
                <p style={s.photoContent}>{selected.content}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: coupleColors.gray50,
  },

  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: '100%',
    backgroundColor: coupleColors.gray50,
  },
  emptyIcon: { fontSize: 52 },
  emptyTitle: { margin: 0, fontSize: 17, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray700 },
  emptyDesc: { margin: 0, fontSize: 13, fontFamily: 'BMHANNAPro, sans-serif', color: coupleColors.gray400, textAlign: 'center', lineHeight: 1.7 },

  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 2,
    padding: 2,
    alignContent: 'start',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    paddingBottom: 80,
  },
  cell: {
    aspectRatio: '1/1',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: coupleColors.gray200,
  },
  cellImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  photoModal: {
    backgroundColor: coupleColors.white,
    borderRadius: 20,
    width: '92%',
    maxWidth: 440,
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  photoHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '14px 14px 10px 16px',
    flexShrink: 0,
  },
  photoDate: { fontSize: 12, color: coupleColors.gray400, fontFamily: 'BMHANNAPro, sans-serif', display: 'block', marginBottom: 2 },
  photoTitle: { margin: 0, fontSize: 16, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray800 },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFull: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', flexShrink: 0 },
  photoBody: { overflowY: 'auto', maxHeight: 120, padding: '10px 16px 14px', scrollbarWidth: 'none' },
  photoContent: { margin: 0, fontSize: 14, fontFamily: 'BMHANNAPro, sans-serif', color: coupleColors.gray600, lineHeight: 1.7 },
};
