import { useState, useEffect, type CSSProperties } from 'react';
import { IoMegaphoneOutline, IoChevronForward } from 'react-icons/io5';
import type { Announcement } from '@we/utils';

const N = {
  gray100: '#f3f4f6', gray200: '#e5e7eb', gray300: '#d1d5db',
  gray400: '#9ca3af', gray800: '#1f2937', white: '#ffffff',
};

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

  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  const ann = announcements[idx];

  return (
    <div style={s.outer}>
      <button style={s.card} onClick={() => onPress(ann.id)}>
        <div style={{ ...s.iconBox, backgroundColor: accentColor + '28' }}>
          <IoMegaphoneOutline size={18} color={accentColor} />
        </div>
        <div style={s.body}>
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

      {announcements.length > 1 && (
        <div style={s.dots}>
          {announcements.map((_, i) => (
            <button
              key={i}
              style={{
                ...s.dot,
                width: i === idx ? 16 : 6,
                backgroundColor: i === idx ? accentColor : N.gray300,
              }}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
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
  dots: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingTop: 6,
    paddingBottom: 2,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};
