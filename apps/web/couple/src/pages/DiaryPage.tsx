import { useState, useRef, type CSSProperties, type ChangeEvent } from 'react';
import { IoListOutline, IoCalendarOutline, IoChevronBack, IoChevronForward, IoAdd, IoClose } from 'react-icons/io5';
import { coupleColors } from '@we/utils';
import type { DiaryEntry } from '@we/utils';
import { myDiaryEntries } from '../data/diaryEntries';

const MOODS = [
  { emoji: '😊', label: '행복해요', color: '#FFD93D' },
  { emoji: '🥰', label: '설레요',   color: '#FF6B9D' },
  { emoji: '😌', label: '평온해요', color: '#74B9FF' },
  { emoji: '🤔', label: '고민돼요', color: '#FDCB6E' },
  { emoji: '😢', label: '슬퍼요',   color: '#8BA4B8' },
  { emoji: '😤', label: '화나요',   color: '#FF7675' },
  { emoji: '😴', label: '피곤해요', color: '#A29BFE' },
  { emoji: '🌸', label: '두근두근', color: '#FD79A8' },
];

type Mood = typeof MOODS[number];
type ViewMode = 'list' | 'calendar';

interface CreateForm {
  mood: Mood;
  title: string;
  content: string;
  image: string | null;
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function buildEntryMap(entries: DiaryEntry[]): Record<string, DiaryEntry[]> {
  const map: Record<string, DiaryEntry[]> = {};
  for (const e of entries) {
    const key = e.createdAt.slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  }
  return map;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function DiaryCard({ entry, onClick }: { entry: DiaryEntry; onClick: () => void }) {
  return (
    <div style={s.card} onClick={onClick}>
      {entry.moodColor && <div style={{ ...s.moodStrip, backgroundColor: entry.moodColor }} />}
      <div style={s.cardBody}>
        <div style={s.cardMeta}>
          <span style={s.dateText}>{formatDate(entry.createdAt)}</span>
          {entry.mood && (
            <div style={{ ...s.moodBadge, backgroundColor: (entry.moodColor ?? '#ccc') + '33' }}>
              <span>{entry.mood}</span>
              {entry.moodLabel && (
                <span style={{ ...s.moodBadgeLabel, color: entry.moodColor ?? coupleColors.gray600 }}>
                  {entry.moodLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <p style={s.entryTitle}>{entry.title}</p>
        <p style={s.entryContent}>{entry.content}</p>
        {entry.image && <img src={entry.image} alt="" style={s.entryImage} />}
      </div>
    </div>
  );
}

export function DiaryPage() {
  const today = new Date();
  const [entries, setEntries] = useState<DiaryEntry[]>(myDiaryEntries);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm | null>(null);
  const [detailEntry, setDetailEntry] = useState<DiaryEntry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const entryMap = buildEntryMap(entries);
  const calDays = getCalendarDays(calYear, calMonth);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  }

  function selectMood(mood: Mood) {
    setShowMoodModal(false);
    setCreateForm({ mood, title: '', content: '', image: null });
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCreateForm(prev => prev ? { ...prev, image: URL.createObjectURL(file) } : prev);
  }

  function submitDiary() {
    if (!createForm) return;
    if (!createForm.title.trim() || !createForm.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      title: createForm.title.trim(),
      content: createForm.content.trim(),
      mood: createForm.mood.emoji,
      moodLabel: createForm.mood.label,
      moodColor: createForm.mood.color,
      image: createForm.image,
      createdAt: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev]);
    setCreateForm(null);
  }

  const selectedDayKey = selectedDay != null
    ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;
  const selectedEntries = selectedDayKey ? (entryMap[selectedDayKey] ?? []) : [];

  const Toggle = (
    <div style={s.toggleWrap}>
      <div style={s.toggleRow}>
        <button
          style={{ ...s.toggleBtn, ...(viewMode === 'list' ? s.toggleBtnActive : {}) }}
          onClick={() => setViewMode('list')}
        >
          <IoListOutline size={16} color={viewMode === 'list' ? '#fff' : coupleColors.gray400} />
          <span style={{ ...s.toggleText, ...(viewMode === 'list' ? s.toggleTextActive : {}) }}>목록</span>
        </button>
        <button
          style={{ ...s.toggleBtn, ...(viewMode === 'calendar' ? s.toggleBtnActive : {}) }}
          onClick={() => setViewMode('calendar')}
        >
          <IoCalendarOutline size={16} color={viewMode === 'calendar' ? '#fff' : coupleColors.gray400} />
          <span style={{ ...s.toggleText, ...(viewMode === 'calendar' ? s.toggleTextActive : {}) }}>캘린더</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      {Toggle}

      {viewMode === 'list' ? (
        <div style={s.list}>
          {entries.map(entry => (
            <DiaryCard key={entry.id} entry={entry} onClick={() => setDetailEntry(entry)} />
          ))}
        </div>
      ) : (
        <div style={s.calendarWrap}>
          {/* 월 네비게이션 */}
          <div style={s.calMonthNav}>
            <button style={s.calNavBtn} onClick={prevMonth}>
              <IoChevronBack size={22} color={coupleColors.gray600} />
            </button>
            <span style={s.calMonthTitle}>{calYear}년 {MONTH_NAMES[calMonth]}</span>
            <button style={s.calNavBtn} onClick={nextMonth}>
              <IoChevronForward size={22} color={coupleColors.gray600} />
            </button>
          </div>

          {/* 캘린더 그리드 */}
          <div style={s.calGrid}>
            {WEEK_DAYS.map((d, i) => (
              <div key={d} style={s.calWeekCell}>
                <span style={{
                  ...s.calWeekDay,
                  ...(i === 0 ? { color: '#ef4444' } : {}),
                  ...(i === 6 ? { color: '#3b82f6' } : {}),
                }}>{d}</span>
              </div>
            ))}

            {calDays.map((day, i) => {
              if (!day) return <div key={`e${i}`} style={s.calDayCell} />;
              const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEntries = entryMap[key] ?? [];
              const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
              const isSelected = selectedDay === day;
              const col = i % 7;

              return (
                <div key={day} style={s.calDayCell} onClick={() => setSelectedDay(isSelected ? null : day)}>
                  <div style={{
                    ...s.calDayCircle,
                    ...(isSelected ? { backgroundColor: '#f4a0a0' } : {}),
                    ...(isToday && !isSelected ? { border: '2px solid #f4a0a0' } : {}),
                  }}>
                    <span style={{
                      ...s.calDayText,
                      ...(col === 0 ? { color: '#ef4444' } : {}),
                      ...(col === 6 ? { color: '#3b82f6' } : {}),
                      ...(isSelected ? { color: '#fff' } : {}),
                    }}>{day}</span>
                  </div>
                  {dayEntries.length > 0 && (
                    <div style={s.dotsRow}>
                      {dayEntries.slice(0, 3).map((e, j) => (
                        <div key={j} style={{ ...s.dot, backgroundColor: e.moodColor ?? coupleColors.gray300 }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 선택된 날 일기 */}
          {selectedDay != null && (
            <div style={s.selectedDaySection}>
              <p style={s.selectedDayTitle}>{calMonth + 1}월 {selectedDay}일</p>
              {selectedEntries.length === 0 ? (
                <p style={s.selectedDayEmpty}>이 날의 일기가 없어요</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedEntries.map(e => (
                    <DiaryCard key={e.id} entry={e} onClick={() => setDetailEntry(e)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button style={s.fab} onClick={() => setShowMoodModal(true)}>
        <IoAdd size={28} color="#fff" />
      </button>

      {/* 일기 상세 모달 */}
      {detailEntry && (
        <div style={s.overlay} onClick={() => setDetailEntry(null)}>
          <div style={s.detailModal} onClick={e => e.stopPropagation()}>
            {detailEntry.moodColor && (
              <div style={{ height: 6, backgroundColor: detailEntry.moodColor, flexShrink: 0 }} />
            )}
            {/* 헤더: 날짜 + 기분 + 닫기 버튼 한 줄 */}
            <div style={s.detailHeader}>
              <span style={s.detailDate}>{formatDate(detailEntry.createdAt)}</span>
              <div style={s.detailHeaderRight}>
                {detailEntry.mood && (
                  <div style={{ ...s.moodBadge, backgroundColor: (detailEntry.moodColor ?? '#ccc') + '33' }}>
                    <span>{detailEntry.mood}</span>
                    {detailEntry.moodLabel && (
                      <span style={{ ...s.moodBadgeLabel, color: detailEntry.moodColor ?? coupleColors.gray600 }}>
                        {detailEntry.moodLabel}
                      </span>
                    )}
                  </div>
                )}
                <button style={s.detailCloseBtn} onClick={() => setDetailEntry(null)}>
                  <IoClose size={20} color={coupleColors.gray400} />
                </button>
              </div>
            </div>
            <div style={s.detailBody}>
              <p style={s.detailTitle}>{detailEntry.title}</p>
              <div style={s.detailDivider} />
              <p style={s.detailContent}>{detailEntry.content}</p>
              {detailEntry.image && (
                <img src={detailEntry.image} alt="" style={s.detailImage} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 기분 선택 모달 */}
      {showMoodModal && (
        <div style={s.overlay} onClick={() => setShowMoodModal(false)}>
          <div style={s.moodModal} onClick={e => e.stopPropagation()}>
            <p style={s.moodModalTitle}>오늘의 기분은<br />어떠셨나요? 🌸</p>
            <div style={s.moodGrid}>
              {MOODS.map(mood => (
                <button
                  key={mood.label}
                  style={{ ...s.moodItem, backgroundColor: mood.color + '22' }}
                  onClick={() => selectMood(mood)}
                >
                  <div style={{ ...s.moodCircle, backgroundColor: mood.color }}>
                    <span style={s.moodCircleEmoji}>{mood.emoji}</span>
                  </div>
                  <span style={{ ...s.moodItemLabel, color: mood.color }}>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 일기 작성 모달 */}
      {createForm && (
        <div style={s.createOverlay}>
          <div style={s.createModal}>
            <div style={s.createHeader}>
              <button style={s.cancelBtn} onClick={() => setCreateForm(null)}>취소</button>
              <span style={s.createHeaderTitle}>일기 작성</span>
              <button style={s.submitBtn} onClick={submitDiary}>등록</button>
            </div>
            <div style={s.createBody}>
              <div style={{ ...s.selectedMoodRow, backgroundColor: createForm.mood.color + '18' }}>
                <span style={{ fontSize: 22 }}>{createForm.mood.emoji}</span>
                <span style={{ ...s.selectedMoodLabel, color: createForm.mood.color }}>{createForm.mood.label}</span>
                <button style={s.changeMoodBtn} onClick={() => { setCreateForm(null); setShowMoodModal(true); }}>변경</button>
              </div>
              <input
                style={s.titleInput}
                placeholder="제목을 입력하세요"
                value={createForm.title}
                onChange={e => setCreateForm(p => p ? { ...p, title: e.target.value } : p)}
                maxLength={50}
              />
              <div style={s.divider} />
              <textarea
                style={s.contentInput}
                placeholder="오늘 있었던 일을 기록해보세요..."
                value={createForm.content}
                onChange={e => setCreateForm(p => p ? { ...p, content: e.target.value } : p)}
              />
              {createForm.image && (
                <div style={s.imagePreviewWrap}>
                  <img src={createForm.image} alt="" style={s.imagePreview} />
                  <button style={s.removeImageBtn} onClick={() => setCreateForm(p => p ? { ...p, image: null } : p)}>✕</button>
                </div>
              )}
            </div>
            <div style={s.createFooter}>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              <button style={s.footerBtn} onClick={() => fileInputRef.current?.click()}>
                <span style={{ fontSize: 18 }}>🖼️</span>
                <span style={s.footerBtnLabel}>이미지 첨부</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    backgroundColor: coupleColors.gray50,
  },

  // 뷰 토글
  toggleWrap: { display: 'flex', justifyContent: 'center', padding: '14px 0 10px' },
  toggleRow: {
    display: 'flex',
    backgroundColor: coupleColors.gray100,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  toggleBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '7px 16px', borderRadius: 8,
    border: 'none', background: 'none', cursor: 'pointer',
  },
  toggleBtnActive: { backgroundColor: '#f4a0a0' },
  toggleText: { fontSize: 13, color: coupleColors.gray400 },
  toggleTextActive: { color: '#fff' },

  // 목록 뷰
  list: {
    display: 'flex', flexDirection: 'column', gap: 12,
    padding: '0 16px 90px',
  },

  // 카드
  card: {
    backgroundColor: coupleColors.white,
    borderRadius: 12, overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    cursor: 'pointer',
  },
  moodStrip: { height: 4 },
  cardBody: { padding: 14 },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dateText: { fontSize: 12, color: coupleColors.gray400 },
  moodBadge: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 14 },
  moodBadgeLabel: { fontSize: 11 },
  entryTitle: { margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: coupleColors.gray800, fontFamily: 'BMJUA, sans-serif' },
  entryContent: {
    margin: 0, fontSize: 14, lineHeight: 1.6, color: coupleColors.gray600, fontFamily: 'BMHANNAPro, sans-serif',
    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  entryImage: { width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block', marginTop: 10, borderRadius: 8 },

  // 캘린더
  calendarWrap: { padding: '0 12px 90px' },
  calMonthNav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  calNavBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: 8, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  calMonthTitle: { fontSize: 18, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray800 },
  calGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
    backgroundColor: coupleColors.white,
    borderRadius: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
    overflow: 'hidden', marginBottom: 16,
  },
  calWeekCell: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 0', backgroundColor: coupleColors.gray50 },
  calWeekDay: { fontSize: 13, fontWeight: 600, color: coupleColors.gray500 },
  calDayCell: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', cursor: 'pointer' },
  calDayCircle: {
    width: 38, height: 38, borderRadius: 19,
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
  },
  calDayText: { fontSize: 15, color: coupleColors.gray700 },
  dotsRow: { display: 'flex', gap: 3, marginTop: 4, height: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  selectedDaySection: { marginTop: 4 },
  selectedDayTitle: { margin: '0 0 12px', fontSize: 15, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray700 },
  selectedDayEmpty: { margin: 0, fontSize: 13, color: coupleColors.gray400, textAlign: 'center', padding: '20px 0' },

  // FAB
  fab: {
    position: 'fixed', bottom: 76, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#f4a0a0', border: 'none', cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  // 상세 모달
  detailModal: {
    backgroundColor: coupleColors.white,
    borderRadius: 20, width: '92%', maxWidth: 480,
    maxHeight: '85vh', display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
  detailHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 12px 12px 16px',
    borderBottom: `1px solid ${coupleColors.gray100}`,
    flexShrink: 0,
  },
  detailHeaderRight: { display: 'flex', alignItems: 'center', gap: 8 },
  detailCloseBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: 6, borderRadius: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  detailBody: { flex: 1, overflowY: 'auto', padding: '14px 16px 20px' },
  detailDate: { fontSize: 13, color: coupleColors.gray400 },
  detailTitle: { margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: coupleColors.gray800, fontFamily: 'BMJUA, sans-serif' },
  detailDivider: { height: 1, backgroundColor: coupleColors.gray100, marginBottom: 14 },
  detailContent: { margin: 0, fontSize: 15, lineHeight: 1.8, color: coupleColors.gray700, fontFamily: 'BMHANNAPro, sans-serif' },
  detailImage: { width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block', marginTop: 16, borderRadius: 10 },

  // 오버레이 공통
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200,
  },
  moodModal: { backgroundColor: coupleColors.white, borderRadius: 24, padding: 28, width: '88%', maxWidth: 360 },
  moodModalTitle: { margin: '0 0 22px', fontSize: 20, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray800, textAlign: 'center', lineHeight: 1.55 },
  moodGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 },
  moodItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 4px', borderRadius: 14, border: 'none', cursor: 'pointer' },
  moodCircle: { width: 50, height: 50, borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  moodCircleEmoji: { fontSize: 26 },
  moodItemLabel: { fontSize: 11, fontFamily: 'BMHANNAPro, sans-serif', textAlign: 'center' },

  // 작성 모달
  createOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  createModal: { backgroundColor: coupleColors.white, borderRadius: 20, width: '92%', maxWidth: 480, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  createHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: `1px solid ${coupleColors.gray100}`, flexShrink: 0 },
  cancelBtn: { background: 'none', border: 'none', fontSize: 15, color: coupleColors.gray500, cursor: 'pointer', fontFamily: 'BMHANNAPro, sans-serif', padding: 4 },
  createHeaderTitle: { fontSize: 16, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray800 },
  submitBtn: { background: 'none', border: 'none', fontSize: 15, color: '#e07878', cursor: 'pointer', fontFamily: 'BMJUA, sans-serif', padding: 4 },
  createBody: { flex: 1, overflowY: 'auto', padding: 16 },
  selectedMoodRow: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 20, marginBottom: 16 },
  selectedMoodLabel: { fontSize: 14, fontFamily: 'BMJUA, sans-serif' },
  changeMoodBtn: { marginLeft: 4, padding: '2px 8px', backgroundColor: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 10, fontSize: 11, color: coupleColors.gray500, cursor: 'pointer', fontFamily: 'BMHANNAPro, sans-serif' },
  titleInput: { width: '100%', border: 'none', outline: 'none', fontSize: 18, fontFamily: 'BMJUA, sans-serif', color: coupleColors.gray800, padding: '8px 0', boxSizing: 'border-box' },
  divider: { height: 1, backgroundColor: coupleColors.gray100, margin: '8px 0' },
  contentInput: { width: '100%', minHeight: 180, border: 'none', outline: 'none', resize: 'none', fontSize: 15, fontFamily: 'BMHANNAPro, sans-serif', color: coupleColors.gray700, lineHeight: 1.7, padding: '4px 0', boxSizing: 'border-box' },
  imagePreviewWrap: { position: 'relative', marginTop: 14, borderRadius: 12, overflow: 'hidden' },
  imagePreview: { width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block' },
  removeImageBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  createFooter: { display: 'flex', padding: '10px 12px', borderTop: `1px solid ${coupleColors.gray100}`, flexShrink: 0 },
  footerBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: coupleColors.gray100, border: 'none', borderRadius: 10, cursor: 'pointer' },
  footerBtnLabel: { fontSize: 13, color: coupleColors.gray600, fontFamily: 'BMHANNAPro, sans-serif' },
};
