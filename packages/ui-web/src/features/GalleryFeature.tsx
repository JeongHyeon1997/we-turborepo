import { useState, useCallback, type CSSProperties, type WheelEvent } from 'react';
import { IoClose, IoAdd, IoRemove, IoDownloadOutline, IoRefreshOutline } from 'react-icons/io5';
import type { DiaryEntry } from '@we/utils';

const N = {
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
  white: '#ffffff',
};

export interface GalleryFeatureProps {
  accentColor: string;
  entries: DiaryEntry[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] ?? 'jpg';
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, '_blank');
  }
}

const VIEWER_STYLE = `
  @keyframes _gallery_open {
    from { opacity:0; transform:scale(0.88); }
    to   { opacity:1; transform:scale(1); }
  }
  ._gallery_enter {
    animation: _gallery_open 0.22s cubic-bezier(0.34,1.2,0.64,1) both;
  }
  ._gallery_overlay_bg {
    animation: none;
    background: rgba(0,0,0,0.92);
  }
`;

export function GalleryFeature({ entries }: GalleryFeatureProps) {
  const [selected, setSelected] = useState<DiaryEntry | null>(null);
  const [zoom, setZoom] = useState(1);
  const withImages = entries.filter(e => !!e.image);

  const openViewer = useCallback((entry: DiaryEntry) => {
    setSelected(entry);
    setZoom(1);
  }, []);

  const closeViewer = useCallback(() => {
    setSelected(null);
    setZoom(1);
  }, []);

  const zoomIn  = useCallback(() => setZoom(z => Math.min(4, parseFloat((z + 0.5).toFixed(1)))), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(0.5, parseFloat((z - 0.5).toFixed(1)))), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    e.stopPropagation();
    setZoom(z => {
      const next = z - e.deltaY * 0.003;
      return Math.min(4, Math.max(0.5, parseFloat(next.toFixed(2))));
    });
  }

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
          <div key={entry.id} style={s.cell} onClick={() => openViewer(entry)}>
            <img src={entry.image!} alt="" style={s.cellImg} />
          </div>
        ))}
      </div>

      {selected && (
        <>
          <style>{VIEWER_STYLE}</style>
          {/* Fullscreen overlay */}
          <div style={s.viewer} onClick={closeViewer} onWheel={handleWheel}>

            {/* Image wrapper — entry animation, click stops propagation */}
            <div
              className="_gallery_enter"
              style={s.imgWrap}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selected.image!}
                alt=""
                style={{ ...s.viewerImg, transform: `scale(${zoom})` }}
              />
              {/* Info overlay at bottom of image */}
              <div style={s.infoBar}>
                <span style={s.infoDate}>{formatDate(selected.createdAt)}</span>
                {selected.title && <span style={s.infoTitle}>{selected.title}</span>}
              </div>
            </div>

            {/* Toolbar */}
            <div style={s.toolbar} onClick={e => e.stopPropagation()}>
              <button style={s.toolBtn} onClick={zoomOut} title="축소">
                <IoRemove size={20} color="#fff" />
              </button>

              <button style={s.zoomLabel} onClick={resetZoom} title="원래 크기">
                <IoRefreshOutline size={13} color="rgba(255,255,255,0.7)" />
                <span>{Math.round(zoom * 100)}%</span>
              </button>

              <button style={s.toolBtn} onClick={zoomIn} title="확대">
                <IoAdd size={20} color="#fff" />
              </button>

              <div style={s.divider} />

              <button
                style={s.toolBtn}
                title="다운로드"
                onClick={() => downloadImage(
                  selected.image!,
                  selected.title || formatDate(selected.createdAt),
                )}
              >
                <IoDownloadOutline size={22} color="#fff" />
              </button>

              <button style={s.toolBtn} onClick={closeViewer} title="닫기">
                <IoClose size={22} color="#fff" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    height: '100%', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', backgroundColor: N.gray50,
  },
  empty: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 10, height: '100%', backgroundColor: N.gray50,
  },
  emptyIcon:  { fontSize: 52 },
  emptyTitle: { margin: 0, fontSize: 17, fontFamily: 'BMJUA, sans-serif', color: N.gray700 },
  emptyDesc:  { margin: 0, fontSize: 13, fontFamily: 'BMHANNAPro, sans-serif', color: N.gray400, textAlign: 'center', lineHeight: 1.7 },

  grid: {
    flex: 1,
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 2, padding: 2, alignContent: 'start',
    overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: 80,
  },
  cell:    { aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer', backgroundColor: N.gray200 },
  cellImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s', },

  // ── Viewer ──────────────────────────────────────────────
  viewer: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.92)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 300,
    userSelect: 'none',
  },
  imgWrap: {
    position: 'relative',
    maxWidth: '90vw', maxHeight: '80vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  viewerImg: {
    maxWidth: '90vw', maxHeight: '80vh',
    objectFit: 'contain', display: 'block',
    transformOrigin: 'center',
    transition: 'transform 0.18s ease',
    willChange: 'transform',
    cursor: 'grab',
  },
  infoBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
    padding: '16px 14px 10px',
    display: 'flex', flexDirection: 'column', gap: 2,
    pointerEvents: 'none',
  },
  infoDate: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)',
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  infoTitle: {
    fontSize: 15, color: '#fff',
    fontFamily: 'BMJUA, sans-serif',
  },

  // ── Toolbar ─────────────────────────────────────────────
  toolbar: {
    display: 'flex', alignItems: 'center', gap: 4,
    marginTop: 16,
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    borderRadius: 40,
    padding: '6px 12px',
  },
  toolBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 40, height: 40, borderRadius: 20,
    background: 'none', border: 'none', cursor: 'pointer',
    transition: 'background 0.15s',
  },
  zoomLabel: {
    display: 'flex', alignItems: 'center', gap: 4,
    minWidth: 56, justifyContent: 'center',
    fontSize: 13, color: 'rgba(255,255,255,0.9)',
    fontFamily: 'BMHANNAPro, sans-serif',
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0 4px',
  },
  divider: {
    width: 1, height: 20,
    background: 'rgba(255,255,255,0.2)',
    margin: '0 4px',
  },
};
