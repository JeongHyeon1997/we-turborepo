import { type CSSProperties } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { marriageColors } from '@we/utils';
import { announcements } from '../data/announcements';

const ACCENT = '#c9a96e';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ann = announcements.find(a => a.id === id);

  if (!ann) return <Navigate to="/announcements" replace />;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          {ann.important && (
            <span style={{ ...s.badge, backgroundColor: ACCENT + '22', color: ACCENT }}>중요</span>
          )}
          <h1 style={s.title}>{ann.title}</h1>
          <p style={s.date}>{formatDate(ann.createdAt)}</p>
        </div>
        <div style={s.divider} />
        <p style={s.content}>{ann.content}</p>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: { padding: '16px' },
  card: {
    backgroundColor: marriageColors.white, borderRadius: 16,
    border: `1px solid ${marriageColors.gray100}`,
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden',
  },
  header: { padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 },
  badge: { alignSelf: 'flex-start', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8, fontFamily: 'BMJUA, sans-serif' },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: marriageColors.gray900, fontFamily: 'BMJUA, sans-serif', lineHeight: 1.4 },
  date: { margin: 0, fontSize: 12, color: marriageColors.gray400 },
  divider: { height: 1, backgroundColor: marriageColors.gray100, marginInline: 20 },
  content: { margin: 0, padding: '16px 20px 24px', fontSize: 14, lineHeight: 1.8, color: marriageColors.gray700, fontFamily: 'BMHANNAPro, sans-serif', whiteSpace: 'pre-line' },
};
