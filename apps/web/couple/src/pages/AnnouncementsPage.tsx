import { type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronForward, IoMegaphoneOutline } from 'react-icons/io5';
import { coupleColors } from '@we/utils';
import type { Announcement } from '@we/utils';
import { announcements } from '../data/announcements';

const ACCENT = '#f4a0a0';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function AnnouncementItem({ ann }: { ann: Announcement }) {
  const navigate = useNavigate();
  return (
    <button style={s.item} onClick={() => navigate(`/announcements/${ann.id}`)}>
      <div style={{ ...s.iconBox, backgroundColor: ACCENT + '28' }}>
        <IoMegaphoneOutline size={20} color={ACCENT} />
      </div>
      <div style={s.body}>
        <div style={s.titleRow}>
          {ann.important && (
            <span style={{ ...s.badge, backgroundColor: ACCENT + '22', color: ACCENT }}>중요</span>
          )}
          <span style={s.title}>{ann.title}</span>
        </div>
        <span style={s.date}>{formatDate(ann.createdAt)}</span>
      </div>
      <IoChevronForward size={16} color={coupleColors.gray400} />
    </button>
  );
}

export function AnnouncementsPage() {
  return (
    <div style={s.page}>
      {announcements.map(ann => (
        <AnnouncementItem key={ann.id} ann={ann} />
      ))}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 16px',
    gap: 8,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 12px',
    backgroundColor: coupleColors.white,
    borderRadius: 12,
    border: `1px solid ${coupleColors.gray100}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    textAlign: 'left',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 6,
    flexShrink: 0,
    fontFamily: 'BMJUA, sans-serif',
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: coupleColors.gray800,
    fontFamily: 'BMJUA, sans-serif',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  date: {
    fontSize: 12,
    color: coupleColors.gray400,
  },
};
