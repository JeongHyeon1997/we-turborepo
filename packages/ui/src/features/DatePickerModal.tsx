import { useState } from 'react';
import {
  View, Text, Pressable, Modal, StyleSheet, Platform, Dimensions,
} from 'react-native';

const N = {
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray700: '#374151',
  gray800: '#1f2937', white: '#ffffff',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// ─── helpers ──────────────────────────────────────────────────────────────────
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

// ─── props ────────────────────────────────────────────────────────────────────
export interface DatePickerModalProps {
  visible: boolean;
  /** 'YYYY-MM-DD' */
  value: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
  title?: string;
  /** max selectable date 'YYYY-MM-DD', defaults to today */
  maxDate?: string;
  /** accent color for selected day + confirm button */
  accentColor?: string;
}

// ─── component ────────────────────────────────────────────────────────────────
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

  function prevMonth() {
    if (viewM === 1) { setViewY(y => y - 1); setViewM(12); }
    else setViewM(m => m - 1);
  }
  function nextMonth() {
    if (!canGoNext) return;
    if (viewM === 12) { setViewY(y => y + 1); setViewM(1); }
    else setViewM(m => m + 1);
  }

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

  // cell width: sheet has 24px horizontal padding on each side
  const screenW = Dimensions.get('window').width;
  const CELL_SIZE = Math.floor(Math.min(screenW - 48, 360) / 7);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={s.overlay} onPress={onCancel}>
        <Pressable style={s.sheet} onPress={() => {}}>
          {/* Handle */}
          <View style={s.handle} />

          {/* Title */}
          <Text style={s.title}>{title}</Text>

          {/* Month navigation */}
          <View style={s.monthNav}>
            <Pressable style={s.navBtn} onPress={prevMonth} hitSlop={8}>
              <Text style={s.navBtnText}>‹</Text>
            </Pressable>
            <Text style={s.monthLabel}>{viewY}년 {pad2(viewM)}월</Text>
            <Pressable
              style={[s.navBtn, !canGoNext && s.navBtnDisabled]}
              onPress={nextMonth}
              disabled={!canGoNext}
              hitSlop={8}
            >
              <Text style={s.navBtnText}>›</Text>
            </Pressable>
          </View>

          {/* Grid */}
          <View style={s.grid}>
            {/* Weekday headers */}
            {WEEKDAYS.map((wd, i) => (
              <View key={wd} style={[s.cell, { width: CELL_SIZE, height: 28 }]}>
                <Text style={[
                  s.weekdayText,
                  i === 0 && s.sunText,
                  i === 6 && s.satText,
                ]}>
                  {wd}
                </Text>
              </View>
            ))}

            {/* Day cells */}
            {cells.map((d, i) => {
              if (!d) return <View key={`e${i}`} style={[s.cell, { width: CELL_SIZE }]} />;

              const disabled = isDisabled(d);
              const selected = isSelected(d);
              const todayCell = isToday(d);
              const dow = i % 7;

              return (
                <Pressable
                  key={`d${d}`}
                  style={[s.cell, { width: CELL_SIZE }, disabled && s.disabledCell]}
                  onPress={() => !disabled && setSel(toIso(viewY, viewM, d))}
                  disabled={disabled}
                >
                  <View style={[
                    s.dayCircle,
                    selected && { backgroundColor: accentColor },
                    todayCell && !selected && { borderWidth: 1.5, borderColor: accentColor },
                  ]}>
                    <Text style={[
                      s.dayText,
                      selected && s.selectedDayText,
                      todayCell && !selected && { color: accentColor, fontFamily: 'BMJUA' },
                      !selected && dow === 0 && s.sunText,
                      !selected && dow === 6 && s.satText,
                      disabled && s.disabledText,
                    ]}>
                      {d}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Buttons */}
          <View style={s.btnRow}>
            <Pressable style={s.cancelBtn} onPress={onCancel}>
              <Text style={s.cancelBtnText}>취소</Text>
            </Pressable>
            <Pressable
              style={[s.confirmBtn, { backgroundColor: accentColor }]}
              onPress={() => onConfirm(sel)}
            >
              <Text style={s.confirmBtnText}>확인</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: N.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 12,
    alignItems: 'center',
    gap: 8,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: N.gray200, borderRadius: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 16, fontFamily: 'BMJUA',
    color: N.gray800, textAlign: 'center',
    marginBottom: 4,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  navBtn: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 8,
  },
  navBtnDisabled: { opacity: 0.25 },
  navBtnText: {
    fontSize: 26, color: N.gray700,
    lineHeight: 30,
    fontFamily: 'System',
  },
  monthLabel: {
    fontSize: 15, fontFamily: 'BMJUA',
    color: N.gray800,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cell: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledCell: { opacity: 0.25 },
  weekdayText: {
    fontSize: 12, fontFamily: 'BMJUA',
    color: N.gray400,
  },
  sunText: { color: '#ef4444' },
  satText: { color: '#3b82f6' },
  dayCircle: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  dayText: {
    fontSize: 14, fontFamily: 'BMHANNAPro',
    color: N.gray800,
  },
  selectedDayText: {
    color: N.white, fontFamily: 'BMJUA',
  },
  disabledText: { color: N.gray400 },
  btnRow: {
    flexDirection: 'row', gap: 10,
    width: '100%', marginTop: 8,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1, borderColor: N.gray200,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15, fontFamily: 'BMJUA', color: N.gray500,
  },
  confirmBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 12, alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 15, fontFamily: 'BMJUA', color: N.white,
  },
});
