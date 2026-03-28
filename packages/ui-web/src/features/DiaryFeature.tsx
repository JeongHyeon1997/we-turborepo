import { useState, useRef, type CSSProperties, type ChangeEvent } from 'react';
import {
  IoListOutline, IoCalendarOutline, IoChevronBack,
  IoChevronForward, IoAdd, IoClose, IoPencil, IoTrash,
} from 'react-icons/io5';
import type { DiaryEntry, Mood } from '@we/utils';

// ─── 공통 뉴트럴 컬러 (모든 앱 동일, Tailwind gray scale) ───────────────────
const N = {
  gray50:  '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray300: '#d1d5db', gray400: '#9ca3af', gray500: '#6b7280',
  gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
  white:   '#ffffff',
};

// ─── 타입 ─────────────────────────────────────────────────────────────────────
type CreateFormData = { mood: Mood; title: string; content: string; image: string | null; imageFile: File | null };
type ViewMode = 'list' | 'calendar';

export interface DiaryFeatureProps {
  /** FAB·토글·선택된 날 원형 등 앱 대표 색상 */
  accentColor: string;
  /** 기분 8종 배열 */
  moods: readonly Mood[];
  /** 기분 선택 모달 타이틀 */
  moodModalTitle: string;
  /** controlled: 항목 목록 */
  entries: DiaryEntry[];
  /** API 로딩 중 여부 */
  loading?: boolean;
  /** 새 항목 추가 (id·createdAt 없이 데이터만 전달) */
  onAddEntry: (data: Omit<DiaryEntry, 'id' | 'createdAt'>) => void | Promise<void>;
  /** 항목 수정 (본인 항목만 호출됨) */
  onUpdateEntry?: (id: string, patch: { title: string; content: string; imageUrl?: string | null }) => void | Promise<void>;
  /** 항목 삭제 (본인 항목만 호출됨) */
  onDeleteEntry?: (id: string) => void | Promise<void>;
  /** 이미지 파일 → 업로드 후 공개 URL 반환 */
  onUploadImage?: (file: File) => Promise<string>;
}

// ─── 달력 헬퍼 ────────────────────────────────────────────────────────────────
const WEEK_DAYS   = ['일','월','화','수','목','금','토'];
const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

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
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

// ─── DiaryCard ────────────────────────────────────────────────────────────────
function DiaryCard({ entry, onClick }: { entry: DiaryEntry; onClick: () => void }) {
  return (
    <div style={card.wrap} onClick={onClick}>
      {entry.moodColor && <div style={{ height: 4, backgroundColor: entry.moodColor }} />}
      <div style={card.body}>
        <div style={card.meta}>
          <span style={card.date}>{formatDate(entry.createdAt)}</span>
          {entry.mood && (
            <div style={{ ...card.badge, backgroundColor: (entry.moodColor ?? '#ccc') + '33' }}>
              <span>{entry.mood}</span>
              {entry.moodLabel && (
                <span style={{ ...card.badgeLabel, color: entry.moodColor ?? N.gray600 }}>
                  {entry.moodLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <p style={card.title}>{entry.title}</p>
        <p style={card.content}>{entry.content}</p>
        {entry.image && <img src={entry.image} alt="" style={card.img} />}
      </div>
    </div>
  );
}

const card: Record<string, CSSProperties> = {
  wrap: { backgroundColor: N.white, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer' },
  body: { padding: 14 },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { fontSize: 12, color: N.gray400 },
  badge: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 14 },
  badgeLabel: { fontSize: 11 },
  title: { margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: N.gray800, fontFamily: 'BMJUA, sans-serif' },
  content: { margin: 0, fontSize: 14, lineHeight: 1.6, color: N.gray600, fontFamily: 'BMHANNAPro, sans-serif', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  img: { width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block', marginTop: 10, borderRadius: 8 },
};

// ─── DiaryFeature ─────────────────────────────────────────────────────────────
export function DiaryFeature({
  accentColor, moods, moodModalTitle, entries, loading,
  onAddEntry, onUpdateEntry, onDeleteEntry, onUploadImage,
}: DiaryFeatureProps) {
  const today = new Date();
  const [viewMode,      setViewMode]      = useState<ViewMode>('list');
  const [calYear,       setCalYear]       = useState(today.getFullYear());
  const [calMonth,      setCalMonth]      = useState(today.getMonth());
  const [selectedDay,   setSelectedDay]   = useState<number | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [createForm,    setCreateForm]    = useState<CreateFormData | null>(null);
  const [submitting,    setSubmitting]    = useState(false);
  const [detailEntry,   setDetailEntry]   = useState<DiaryEntry | null>(null);
  const [isEditing,     setIsEditing]     = useState(false);
  const [editTitle,     setEditTitle]     = useState('');
  const [editContent,   setEditContent]   = useState('');
  const [editImage,     setEditImage]     = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [actionBusy,    setActionBusy]    = useState(false);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const entryMap = buildEntryMap(entries);
  const calDays  = getCalendarDays(calYear, calMonth);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); }
    else setCalMonth(m => m-1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); }
    else setCalMonth(m => m+1);
    setSelectedDay(null);
  }

  function selectMood(mood: Mood) {
    setShowMoodModal(false);
    setCreateForm({ mood, title: '', content: '', image: null, imageFile: null });
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCreateForm(prev => prev ? { ...prev, image: URL.createObjectURL(file), imageFile: file } : prev);
    e.target.value = '';
  }

  async function submitDiary() {
    if (!createForm) return;
    if (!createForm.title.trim() || !createForm.content.trim()) { alert('제목과 내용을 입력해주세요.'); return; }
    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (createForm.imageFile && onUploadImage) {
        imageUrl = await onUploadImage(createForm.imageFile);
      }
      await onAddEntry({
        title: createForm.title.trim(),
        content: createForm.content.trim(),
        mood: createForm.mood.emoji,
        moodLabel: createForm.mood.label,
        moodColor: createForm.mood.color,
        image: imageUrl,
      });
      setCreateForm(null);
    } catch {
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit() {
    if (!detailEntry) return;
    setEditTitle(detailEntry.title ?? '');
    setEditContent(detailEntry.content);
    setEditImage(detailEntry.image ?? null);
    setEditImageFile(null);
    setIsEditing(true);
  }

  function handleEditImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImage(URL.createObjectURL(file));
    e.target.value = '';
  }

  async function submitEdit() {
    if (!detailEntry || !onUpdateEntry) return;
    if (!editTitle.trim() || !editContent.trim()) { alert('제목과 내용을 입력해주세요.'); return; }
    setActionBusy(true);
    try {
      let imageUrl: string | null = editImage;
      if (editImageFile && onUploadImage) {
        imageUrl = await onUploadImage(editImageFile);
      }
      await onUpdateEntry(detailEntry.id, { title: editTitle.trim(), content: editContent.trim(), imageUrl });
      setDetailEntry(prev => prev ? { ...prev, title: editTitle.trim(), content: editContent.trim(), image: imageUrl ?? undefined } : prev);
      setIsEditing(false);
    } catch {
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setActionBusy(false);
    }
  }

  async function handleDelete() {
    if (!detailEntry || !onDeleteEntry) return;
    if (!window.confirm('일기를 삭제할까요?')) return;
    setActionBusy(true);
    try {
      await onDeleteEntry(detailEntry.id);
      setDetailEntry(null);
    } catch {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setActionBusy(false);
    }
  }

  const selectedDayKey  = selectedDay != null ? `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}` : null;
  const selectedEntries = selectedDayKey ? (entryMap[selectedDayKey] ?? []) : [];

  // 뷰 토글 버튼
  const Toggle = (
    <div style={s.toggleWrap}>
      <div style={s.toggleRow}>
        {(['list','calendar'] as const).map(m => (
          <button key={m}
            style={{ ...s.toggleBtn, ...(viewMode === m ? { backgroundColor: accentColor } : {}) }}
            onClick={() => setViewMode(m)}
          >
            {m === 'list'
              ? <IoListOutline size={16} color={viewMode === m ? '#fff' : N.gray400} />
              : <IoCalendarOutline size={16} color={viewMode === m ? '#fff' : N.gray400} />}
            <span style={{ ...s.toggleText, ...(viewMode === m ? { color: '#fff' } : {}) }}>
              {m === 'list' ? '목록' : '캘린더'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      {Toggle}

      {/* ── 로딩 ─────────────────────────────────────────── */}
      {loading && (
        <div style={s.loadingWrap}>
          <div style={{ ...s.loadingDot, backgroundColor: accentColor }} />
          <div style={{ ...s.loadingDot, backgroundColor: accentColor, animationDelay: '0.15s' }} />
          <div style={{ ...s.loadingDot, backgroundColor: accentColor, animationDelay: '0.3s' }} />
        </div>
      )}

      {/* ── 목록 뷰 ─────────────────────────────────────────── */}
      {!loading && viewMode === 'list' ? (
        <div style={s.list}>
          {entries.length === 0 && (
            <p style={s.emptyText}>아직 일기가 없어요. + 버튼을 눌러 첫 일기를 써보세요!</p>
          )}
          {entries.map(e => <DiaryCard key={e.id} entry={e} onClick={() => { setDetailEntry(e); setIsEditing(false); }} />)}
        </div>
      ) : !loading ? (
        /* ── 캘린더 뷰 ─────────────────────────────────── */
        <div style={s.calWrap}>
          <div style={s.calMonthNav}>
            <button style={s.calNavBtn} onClick={prevMonth}><IoChevronBack size={22} color={N.gray600} /></button>
            <span style={s.calMonthTitle}>{calYear}년 {MONTH_NAMES[calMonth]}</span>
            <button style={s.calNavBtn} onClick={nextMonth}><IoChevronForward size={22} color={N.gray600} /></button>
          </div>
          <div style={s.calGrid}>
            {WEEK_DAYS.map((d, i) => (
              <div key={d} style={s.calWeekCell}>
                <span style={{ ...s.calWeekDay, ...(i===0?{color:'#ef4444'}:{}), ...(i===6?{color:'#3b82f6'}:{}) }}>{d}</span>
              </div>
            ))}
            {calDays.map((day, i) => {
              if (!day) return <div key={`e${i}`} style={s.calDayCell} />;
              const key = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const dayEntries = entryMap[key] ?? [];
              const isToday    = calYear===today.getFullYear() && calMonth===today.getMonth() && day===today.getDate();
              const isSelected = selectedDay === day;
              const col = i % 7;
              return (
                <div key={day} style={s.calDayCell} onClick={() => setSelectedDay(isSelected ? null : day)}>
                  <div style={{
                    ...s.calDayCircle,
                    ...(isSelected ? { backgroundColor: accentColor } : {}),
                    ...(isToday && !isSelected ? { border: `2px solid ${accentColor}` } : {}),
                  }}>
                    <span style={{ ...s.calDayText, ...(col===0?{color:'#ef4444'}:{}), ...(col===6?{color:'#3b82f6'}:{}), ...(isSelected?{color:'#fff'}:{}) }}>{day}</span>
                  </div>
                  {dayEntries.length > 0 && (
                    <div style={s.dotsRow}>
                      {dayEntries.slice(0,3).map((e,j) => <div key={j} style={{ ...s.dot, backgroundColor: e.moodColor ?? N.gray300 }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={s.calEntries}>
            {selectedDay != null ? (
              <div>
                <p style={s.selectedDayTitle}>{calMonth+1}월 {selectedDay}일</p>
                {selectedEntries.length === 0
                  ? <p style={s.selectedDayEmpty}>이 날의 일기가 없어요</p>
                  : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {selectedEntries.map(e => <DiaryCard key={e.id} entry={e} onClick={() => { setDetailEntry(e); setIsEditing(false); }} />)}
                    </div>}
              </div>
            ) : <p style={s.selectedDayEmpty}>날짜를 선택하면 일기를 볼 수 있어요</p>}
          </div>
        </div>
      ) : null}

      {/* ── FAB ───────────────────────────────────────────────── */}
      {!loading && (
        <button style={{ ...s.fab, backgroundColor: accentColor }} onClick={() => setShowMoodModal(true)}>
          <IoAdd size={28} color="#fff" />
        </button>
      )}

      {/* ── 상세 모달 ─────────────────────────────────────────── */}
      {detailEntry && (
        <div style={s.overlay} onClick={() => { setDetailEntry(null); setIsEditing(false); }}>
          <div style={s.detailModal} onClick={e => e.stopPropagation()}>
            {detailEntry.moodColor && <div style={{ height:6, backgroundColor:detailEntry.moodColor, flexShrink:0 }} />}
            <div style={s.detailHeader}>
              <span style={s.detailDate}>{formatDate(detailEntry.createdAt)}</span>
              <div style={s.detailHeaderRight}>
                {detailEntry.mood && !isEditing && (
                  <div style={{ ...card.badge, backgroundColor: (detailEntry.moodColor ?? '#ccc') + '33' }}>
                    <span>{detailEntry.mood}</span>
                    {detailEntry.moodLabel && <span style={{ ...card.badgeLabel, color: detailEntry.moodColor ?? N.gray600 }}>{detailEntry.moodLabel}</span>}
                  </div>
                )}
                {onUpdateEntry && !isEditing && (
                  <button style={s.iconBtn} onClick={openEdit} title="수정">
                    <IoPencil size={17} color={N.gray400} />
                  </button>
                )}
                {onDeleteEntry && !isEditing && (
                  <button style={s.iconBtn} onClick={handleDelete} disabled={actionBusy} title="삭제">
                    <IoTrash size={17} color={actionBusy ? N.gray300 : '#ef4444'} />
                  </button>
                )}
                <button style={s.iconBtn} onClick={() => { setDetailEntry(null); setIsEditing(false); }}>
                  <IoClose size={20} color={N.gray400} />
                </button>
              </div>
            </div>

            {isEditing ? (
              /* ── 수정 모드 ── */
              <div style={s.editBody}>
                <input
                  style={s.editTitleInput}
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  maxLength={50}
                  placeholder="제목"
                />
                <div style={s.divider} />
                <textarea
                  style={s.editContentInput}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="내용"
                />
                {editImage ? (
                  <div style={s.imgPreview}>
                    <img src={editImage} alt="" style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block' }} />
                    <div style={s.editImgOverlay}>
                      <button style={s.editImgBtn} onClick={() => editFileInputRef.current?.click()}>교체</button>
                      <button style={s.editImgBtn} onClick={() => { setEditImage(null); setEditImageFile(null); }}>삭제</button>
                    </div>
                  </div>
                ) : (
                  <button style={s.addImgBtn} onClick={() => editFileInputRef.current?.click()}>
                    <span style={{ fontSize: 16 }}>🖼️</span>
                    <span style={s.footerBtnLabel}>이미지 추가</span>
                  </button>
                )}
                <input ref={editFileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleEditImageChange} />
                <div style={s.editActions}>
                  <button style={s.cancelBtn} onClick={() => setIsEditing(false)}>취소</button>
                  <button
                    style={{ ...s.submitBtn, color: accentColor, opacity: actionBusy ? 0.5 : 1 }}
                    onClick={submitEdit}
                    disabled={actionBusy}
                  >
                    {actionBusy ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            ) : (
              /* ── 읽기 모드 ── */
              <div style={s.detailBody}>
                <p style={s.detailTitle}>{detailEntry.title}</p>
                <div style={s.divider} />
                <p style={s.detailContent}>{detailEntry.content}</p>
                {detailEntry.image && <img src={detailEntry.image} alt="" style={s.detailImg} />}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 기분 선택 모달 ────────────────────────────────────── */}
      {showMoodModal && (
        <div style={s.overlay} onClick={() => setShowMoodModal(false)}>
          <div style={s.moodModal} onClick={e => e.stopPropagation()}>
            <p style={s.moodModalTitle} dangerouslySetInnerHTML={{ __html: moodModalTitle.replace(/\n/g,'<br/>') }} />
            <div style={s.moodGrid}>
              {moods.map(mood => (
                <button key={mood.label} style={{ ...s.moodItem, backgroundColor: mood.color+'22' }} onClick={() => selectMood(mood)}>
                  <div style={{ ...s.moodCircle, backgroundColor: mood.color }}>
                    <span style={s.moodEmoji}>{mood.emoji}</span>
                  </div>
                  <span style={{ ...s.moodLabel, color: mood.color }}>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 작성 모달 ─────────────────────────────────────────── */}
      {createForm && (
        <div style={s.createOverlay}>
          <div style={s.createModal}>
            <div style={s.createHeader}>
              <button style={s.cancelBtn} onClick={() => setCreateForm(null)}>취소</button>
              <span style={s.createTitle}>일기 작성</span>
              <button
                style={{ ...s.submitBtn, color: accentColor, opacity: submitting ? 0.5 : 1 }}
                onClick={submitDiary}
                disabled={submitting}
              >
                {submitting ? '저장 중...' : '등록'}
              </button>
            </div>
            <div style={s.createBody}>
              <div style={{ ...s.moodRow, backgroundColor: createForm.mood.color+'18' }}>
                <span style={{ fontSize:22 }}>{createForm.mood.emoji}</span>
                <span style={{ ...s.moodRowLabel, color: createForm.mood.color }}>{createForm.mood.label}</span>
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
                <div style={s.imgPreview}>
                  <img src={createForm.image} alt="" style={{ width:'100%', aspectRatio:'3/2', objectFit:'cover', display:'block' }} />
                  <button style={s.removeImgBtn} onClick={() => setCreateForm(p => p ? { ...p, image:null } : p)}>✕</button>
                </div>
              )}
            </div>
            <div style={s.createFooter}>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageChange} />
              <button style={s.footerBtn} onClick={() => fileInputRef.current?.click()}>
                <span style={{ fontSize:18 }}>🖼️</span>
                <span style={s.footerBtnLabel}>이미지 첨부</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────────────────
const s: Record<string, CSSProperties> = {
  page: { height:'100%', display:'flex', flexDirection:'column', overflow:'hidden', backgroundColor:N.gray50 },

  loadingWrap: { display:'flex', justifyContent:'center', alignItems:'center', gap:8, padding:'40px 0' },
  loadingDot: { width:10, height:10, borderRadius:5, animation:'bounce 0.9s ease-in-out infinite' },

  emptyText: { textAlign:'center', color:N.gray400, fontSize:13, margin:'40px 16px', lineHeight:1.8 },

  toggleWrap: { display:'flex', justifyContent:'center', padding:'14px 0 10px', flexShrink:0 },
  toggleRow: { display:'flex', backgroundColor:N.gray100, borderRadius:10, padding:3, gap:2 },
  toggleBtn: { display:'flex', alignItems:'center', gap:5, padding:'7px 16px', borderRadius:8, border:'none', backgroundColor:'transparent', cursor:'pointer' },
  toggleText: { fontSize:13, color:N.gray400 },

  list: { flex:1, display:'flex', flexDirection:'column', gap:12, padding:'0 16px 90px', overflowY:'auto', scrollbarWidth:'none' },

  calWrap: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden', padding:'0 12px' },
  calEntries: { flex:1, overflowY:'auto', scrollbarWidth:'none', padding:'0 0 90px' },
  calMonthNav: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  calNavBtn: { background:'none', border:'none', cursor:'pointer', padding:8, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' },
  calMonthTitle: { fontSize:18, fontFamily:'BMJUA, sans-serif', color:N.gray800 },
  calGrid: { display:'grid', gridTemplateColumns:'repeat(7, 1fr)', backgroundColor:N.white, borderRadius:16, boxShadow:'0 1px 6px rgba(0,0,0,0.08)', overflow:'hidden', marginBottom:16 },
  calWeekCell: { display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 0', backgroundColor:N.gray50 },
  calWeekDay: { fontSize:13, fontWeight:600, color:N.gray500 },
  calDayCell: { display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 0', cursor:'pointer' },
  calDayCircle: { width:38, height:38, borderRadius:19, display:'flex', alignItems:'center', justifyContent:'center', boxSizing:'border-box' },
  calDayText: { fontSize:15, color:N.gray700 },
  dotsRow: { display:'flex', gap:3, marginTop:4, height:6 },
  dot: { width:6, height:6, borderRadius:3 },
  selectedDayTitle: { margin:'0 0 12px', fontSize:15, fontFamily:'BMJUA, sans-serif', color:N.gray700 },
  selectedDayEmpty: { margin:0, fontSize:13, color:N.gray400, textAlign:'center', padding:'20px 0' },

  fab: { position:'fixed', bottom:76, right:20, width:52, height:52, borderRadius:26, border:'none', cursor:'pointer', boxShadow:'0 2px 10px rgba(0,0,0,0.18)', display:'flex', alignItems:'center', justifyContent:'center' },

  overlay: { position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 },
  detailModal: { backgroundColor:N.white, borderRadius:20, width:'92%', maxWidth:480, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden' },
  detailHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 12px 12px 16px', borderBottom:`1px solid ${N.gray100}`, flexShrink:0 },
  detailHeaderRight: { display:'flex', alignItems:'center', gap:6 },
  iconBtn: { background:'none', border:'none', cursor:'pointer', padding:6, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center' },
  detailBody: { flex:1, overflowY:'auto', padding:'14px 16px 20px' },
  detailDate: { fontSize:13, color:N.gray400 },
  detailTitle: { margin:'0 0 12px', fontSize:20, fontWeight:700, color:N.gray800, fontFamily:'BMJUA, sans-serif' },
  divider: { height:1, backgroundColor:N.gray100, margin:'8px 0' },
  detailContent: { margin:0, fontSize:15, lineHeight:1.8, color:N.gray700, fontFamily:'BMHANNAPro, sans-serif' },
  detailImg: { width:'100%', aspectRatio:'3/2', objectFit:'cover', display:'block', marginTop:16, borderRadius:10 },

  editBody: { flex:1, overflowY:'auto', padding:'14px 16px 8px', display:'flex', flexDirection:'column', gap:0 },
  editTitleInput: { width:'100%', border:'none', outline:'none', fontSize:18, fontFamily:'BMJUA, sans-serif', color:N.gray800, padding:'8px 0', boxSizing:'border-box' },
  editContentInput: { width:'100%', minHeight:120, border:'none', outline:'none', resize:'none', fontSize:15, fontFamily:'BMHANNAPro, sans-serif', color:N.gray700, lineHeight:1.7, padding:'4px 0', boxSizing:'border-box' },
  editImgOverlay: { position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', gap:10, backgroundColor:'rgba(0,0,0,0.35)' },
  editImgBtn: { padding:'6px 16px', borderRadius:20, border:'none', backgroundColor:'rgba(255,255,255,0.9)', fontSize:13, cursor:'pointer', fontFamily:'BMHANNAPro, sans-serif', color:N.gray700 },
  addImgBtn: { display:'flex', alignItems:'center', gap:6, padding:'8px 12px', background:N.gray100, border:'none', borderRadius:10, cursor:'pointer', marginTop:10, alignSelf:'flex-start' },
  editActions: { display:'flex', justifyContent:'flex-end', gap:8, padding:'12px 0 4px', flexShrink:0 },

  moodModal: { backgroundColor:N.white, borderRadius:24, padding:28, width:'88%', maxWidth:360 },
  moodModalTitle: { margin:'0 0 22px', fontSize:20, fontFamily:'BMJUA, sans-serif', color:N.gray800, textAlign:'center', lineHeight:1.55 },
  moodGrid: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 },
  moodItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'10px 4px', borderRadius:14, border:'none', cursor:'pointer' },
  moodCircle: { width:50, height:50, borderRadius:25, display:'flex', alignItems:'center', justifyContent:'center' },
  moodEmoji: { fontSize:26 },
  moodLabel: { fontSize:11, fontFamily:'BMHANNAPro, sans-serif', textAlign:'center' },

  createOverlay: { position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 },
  createModal: { backgroundColor:N.white, borderRadius:20, width:'92%', maxWidth:480, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden' },
  createHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:16, borderBottom:`1px solid ${N.gray100}`, flexShrink:0 },
  cancelBtn: { background:'none', border:'none', fontSize:15, color:N.gray500, cursor:'pointer', fontFamily:'BMHANNAPro, sans-serif', padding:4 },
  createTitle: { fontSize:16, fontFamily:'BMJUA, sans-serif', color:N.gray800 },
  submitBtn: { background:'none', border:'none', fontSize:15, cursor:'pointer', fontFamily:'BMJUA, sans-serif', padding:4 },
  createBody: { flex:1, overflowY:'auto', padding:16 },
  moodRow: { display:'inline-flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:20, marginBottom:16 },
  moodRowLabel: { fontSize:14, fontFamily:'BMJUA, sans-serif' },
  changeMoodBtn: { marginLeft:4, padding:'2px 8px', backgroundColor:'rgba(0,0,0,0.06)', border:'none', borderRadius:10, fontSize:11, color:N.gray500, cursor:'pointer', fontFamily:'BMHANNAPro, sans-serif' },
  titleInput: { width:'100%', border:'none', outline:'none', fontSize:18, fontFamily:'BMJUA, sans-serif', color:N.gray800, padding:'8px 0', boxSizing:'border-box' },
  contentInput: { width:'100%', minHeight:180, border:'none', outline:'none', resize:'none', fontSize:15, fontFamily:'BMHANNAPro, sans-serif', color:N.gray700, lineHeight:1.7, padding:'4px 0', boxSizing:'border-box' },
  imgPreview: { position:'relative', marginTop:14, borderRadius:12, overflow:'hidden' },
  removeImgBtn: { position:'absolute', top:8, right:8, width:28, height:28, borderRadius:14, backgroundColor:'rgba(0,0,0,0.5)', color:'#fff', border:'none', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' },
  createFooter: { display:'flex', padding:'10px 12px', borderTop:`1px solid ${N.gray100}`, flexShrink:0 },
  footerBtn: { display:'flex', alignItems:'center', gap:6, padding:'7px 12px', background:N.gray100, border:'none', borderRadius:10, cursor:'pointer' },
  footerBtnLabel: { fontSize:13, color:N.gray600, fontFamily:'BMHANNAPro, sans-serif' },
};
