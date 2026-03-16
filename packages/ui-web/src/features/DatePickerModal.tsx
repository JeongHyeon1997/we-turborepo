import { useState, type CSSProperties } from 'react';

const N = {
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray300: '#d1d5db', gray400: '#9ca3af', gray500: '#6b7280',
  gray700: '#374151', gray800: '#1f2937', white: '#ffffff',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export interface DatePickerModalProps {
  visible: boolean;
  /** 'YYYY-MM-DD' */
  value: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
  title?: string;
  /** max selectable date 'YYYY-MM-DD', defaults to today */
  maxDate?: string;
  accentColor?: string;
}

function pad2(n: number) { return String(n).padStart(2, '0'); }
function toIso(y: number, m: number, d: number) { return `${y}-${pad2(m)}-${pad2(d)}`; }
function todayIso() { return new Date().toISOString().slice(0, 10); }
function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: m || 1, d: d || 1 };
}
function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }

function buildCells(y: number, m: number): (number | null)[] {
  const firstDay = new Date(y, m - 1, 1).getDay();
  const total = daysInMonth(y, m);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DatePickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
  title = '날짜 선택',
  maxDate,
  accentColor = '#f4a0a0',
}: DatePickerModalProps) {
  const today = todayIso();
  const maxIso = maxDate ?? today;
  const init = parseDate(value || today);

  const [viewY, setViewY] = useState(init.y);
  const [viewM, setViewM] = useState(init.m);
  const [sel, setSel] = useState(value || today);

  if (!visible) return null;

  function prevMonth() {
    if (viewM === 1) { setViewY(y => y - 1); setViewM(12); }
    else setViewM(m => m - 1);
  }
  function nextMonth() {
    if (!canGoNext) return;
    if (viewM === 12) { setViewY(y => y + 1); setViewM(1); }
    else setViewM(m => m + 1);
  }

  // Can go to next month only if its first day is within maxDate
  const nextMonthFirst = viewM === 12 ? toIso(viewY + 1, 1, 1) : toIso(viewY, viewM + 1, 1);
  const canGoNext = nextMonthFirst <= maxIso;

  const cells = buildCells(viewY, viewM);
  const selParsed = parseDate(sel);

  function isSelected(d: number) {
    return selParsed.y === viewY && selParsed.m === viewM && selParsed.d === d;
  }
  function isToday(d: number) {
    const t = parseDate(today);
    return t.y === viewY && t.m === viewM && t.d === d;
  }
  function isDisabled(d: number) {
    return toIso(viewY, viewM, d) > maxIso;
  }

  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.sheet} onClick={e => e.stopPropagation()}>
        <div style={s.handle} />
        <p style={s.title}>{title}</p>

        {/* Month navigation */}
        <div style={s.monthNav}>
          <button style={s.navBtn} onClick={prevMonth}>‹</button>
          <span style={s.monthLabel}>{viewY}년 {pad2(viewM)}월</span>
          <button
            style={{ ...s.navBtn, opacity: canGoNext ? 1 : 0.25, cursor: canGoNext ? 'pointer' : 'default' }}
            onClick={nextMonth}
          >›</button>
        </div>

        {/* Calendar grid */}
        <div style={s.grid}>
          {/* Weekday row */}
          {WEEKDAYS.map((wd, i) => (
            <div key={wd} style={{
              ...s.cell,
              fontSize: 12,
              fontFamily: 'BMJUA, sans-serif',
              height: 28,
              color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : N.gray400,
            }}>
              {wd}
            </div>
          ))}

          {/* Day cells */}
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`} style={s.cell} />;
            const disabled = isDisabled(d);
            const selected = isSelected(d);
            const todayCell = isToday(d);
            const dow = i % 7;
            const textColor = selected
              ? N.white
              : todayCell
              ? accentColor
              : dow === 0
              ? '#ef4444'
              : dow === 6
              ? '#3b82f6'
              : N.gray800;

            return (
              <div
                key={`d${d}`}
                style={{ ...s.cell, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.25 : 1 }}
                onClick={() => !disabled && setSel(toIso(viewY, viewM, d))}
              >
                <div style={{
                  ...s.dayCircle,
                  backgroundColor: selected ? accentColor : 'transparent',
                  boxShadow: todayCell && !selected ? `0 0 0 1.5px ${accentColor}` : 'none',
                  color: textColor,
                  fontWeight: selected || todayCell ? 700 : 400,
                }}>
                  {d}
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={s.btnRow}>
          <button style={s.cancelBtn} onClick={onCancel}>취소</button>
          <button
            style={{ ...s.confirmBtn, background: accentColor }}
            onClick={() => onConfirm(sel)}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 999,
  },
  sheet: {
    width: '100%', maxWidth: 480,
    backgroundColor: N.white,
    borderRadius: '20px 20px 0 0',
    padding: '12px 20px 36px',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: N.gray200, borderRadius: 2,
    alignSelf: 'center', marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 16, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: N.gray800,
    textAlign: 'center', marginBottom: 4,
  },
  monthNav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 4,
  },
  navBtn: {
    background: 'none', border: 'none',
    fontSize: 26, lineHeight: 1,
    cursor: 'pointer', color: N.gray700,
    padding: '4px 12px', borderRadius: 8,
    fontFamily: 'sans-serif',
  },
  monthLabel: {
    fontSize: 15, fontFamily: 'BMJUA, sans-serif',
    color: N.gray800, fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: 2,
  },
  cell: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 40,
  },
  dayCircle: {
    width: 34, height: 34, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontFamily: 'BMHANNAPro, sans-serif',
    transition: 'background 0.15s',
    userSelect: 'none',
  },
  btnRow: {
    display: 'flex', gap: 10, marginTop: 12,
  },
  cancelBtn: {
    flex: 1, padding: '13px 0',
    borderRadius: 12, border: `1px solid ${N.gray200}`,
    background: N.white, fontSize: 15,
    fontFamily: 'BMJUA, sans-serif', color: N.gray500, cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1, padding: '13px 0',
    borderRadius: 12, border: 'none',
    fontSize: 15, fontFamily: 'BMJUA, sans-serif',
    color: N.white, cursor: 'pointer', fontWeight: 700,
  },
};
