import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { IoMegaphoneOutline, IoChevronForward } from 'react-icons/io5';
import type { Announcement } from '@we/utils';

const N = {
  gray100: '#f3f4f6', gray400: '#9ca3af', gray800: '#1f2937', white: '#ffffff',
};

// 키프레임 한 번만 주입
const STYLE_ID = 'ann-banner-anim';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes ann-slide-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
  `;
  document.head.appendChild(el);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export interface AnnouncementBannerProps {
  announcements: Announcement[];
  accentColor: string;
  onPress: (id: string) => void;
}

export function AnnouncementBanner({ announcements, accentColor, onPress }: AnnouncementBannerProps) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (announcements.length <= 1) return;
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % announcements.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  const ann = announcements[idx];

  return (
    <div style={s.outer}>
      <button style={s.card} onClick={() => onPress(ann.id)}>
        <div style={{ ...s.iconBox, backgroundColor: accentColor + '28' }}>
          <IoMegaphoneOutline size={18} color={accentColor} />
        </div>

        {/* key 변경 시 div 재마운트 → 애니메이션 재실행 */}
        <div key={idx} style={s.body}>
          {ann.important && (
            <span style={{ ...s.importantTag, backgroundColor: accentColor + '22', color: accentColor }}>
              중요
            </span>
          )}
          <span style={s.title}>{ann.title}</span>
          <span style={s.date}>{formatDate(ann.createdAt)}</span>
        </div>

        <IoChevronForward size={16} color={N.gray400} />
      </button>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  outer: {
    padding: '10px 16px 2px',
    flexShrink: 0,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '10px 12px',
    backgroundColor: N.white,
    borderRadius: 12,
    border: `1px solid ${N.gray100}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    textAlign: 'left',
    overflow: 'hidden',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
    animation: 'ann-slide-in 0.35s ease both',
  },
  importantTag: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: 6,
    fontFamily: 'BMJUA, sans-serif',
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: N.gray800,
    fontFamily: 'BMJUA, sans-serif',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  date: {
    fontSize: 11,
    color: N.gray400,
  },
};
