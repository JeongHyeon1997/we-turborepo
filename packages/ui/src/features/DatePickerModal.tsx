import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, Modal, ScrollView, StyleSheet, Platform,
} from 'react-native';

const N = {
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray700: '#374151',
  gray800: '#1f2937', white: '#ffffff',
};

const ITEM_H = 44;
const PAD    = 2;             // 위아래 패딩 아이템 수
const VIS    = PAD * 2 + 1;  // 보이는 아이템 수 (5)
const COL_H  = ITEM_H * VIS; // 전체 높이

// ─── 헬퍼 ─────────────────────────────────────────────────────────────────────
function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function pad2(n: number) { return String(n).padStart(2, '0'); }

function today() {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
}

function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

// ─── WheelColumn ──────────────────────────────────────────────────────────────
function WheelColumn({
  items,
  selectedIndex,
  onIndexChange,
  width,
}: {
  items: string[];
  selectedIndex: number;
  onIndexChange: (idx: number) => void;
  width: number;
}) {
  const ref = useRef<ScrollView>(null);
  const lastIdx = useRef(selectedIndex);

  useEffect(() => {
    // 마운트 시 선택 항목으로 스크롤
    ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
  }, []);

  const handleScrollEnd = useCallback((e: any) => {
    const offset = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(offset / ITEM_H)));
    if (idx !== lastIdx.current) {
      lastIdx.current = idx;
      onIndexChange(idx);
    }
  }, [items.length, onIndexChange]);

  return (
    <View style={{ width, height: COL_H, overflow: 'hidden' }}>
      {/* 선택 행 하이라이트 */}
      <View
        style={[StyleSheet.absoluteFill, {
          top: ITEM_H * PAD, height: ITEM_H,
          backgroundColor: N.gray100, borderRadius: 8,
          marginHorizontal: 4,
        }]}
        pointerEvents="none"
      />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_H * PAD }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {items.map((label, i) => {
          const isSelected = i === selectedIndex;
          return (
            <View key={i} style={s.wheelItem}>
              <Text style={[s.wheelText, isSelected && s.wheelTextSelected]}>
                {label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── DatePickerModal ──────────────────────────────────────────────────────────
export interface DatePickerModalProps {
  visible: boolean;
  /** 'YYYY-MM-DD' */
  value: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
  title?: string;
  /** max date 'YYYY-MM-DD', defaults to today */
  maxDate?: string;
  /** accent color for confirm button */
  accentColor?: string;
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
  const todayVals = today();
  const maxVals   = maxDate ? parseDate(maxDate) : todayVals;
  const initVals  = value ? parseDate(value) : todayVals;

  const minYear = todayVals.y - 10;
  const maxYear = maxVals.y;

  const years  = Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(minYear + i));
  const months = Array.from({ length: 12 }, (_, i) => pad2(i + 1));

  const [y, setY] = useState(initVals.y);
  const [m, setM] = useState(initVals.m);
  const [d, setD] = useState(initVals.d);

  const days = Array.from({ length: daysInMonth(y, m) }, (_, i) => pad2(i + 1));

  // 월 변경 시 일자 범위 초과 방지
  useEffect(() => {
    const maxD = daysInMonth(y, m);
    if (d > maxD) setD(maxD);
  }, [y, m]);

  const yIdx = years.indexOf(String(y));
  const mIdx = months.indexOf(pad2(m));
  const dIdx = days.indexOf(pad2(d));

  function handleConfirm() {
    onConfirm(`${y}-${pad2(m)}-${pad2(d)}`);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={s.overlay} onPress={onCancel}>
        <Pressable style={s.sheet} onPress={() => {}}>
          <View style={s.handle} />
          <Text style={s.title}>{title}</Text>

          {/* 휠 피커 */}
          <View style={s.wheelRow}>
            {/* 연도 */}
            <View style={s.wheelCol}>
              <WheelColumn
                items={years}
                selectedIndex={yIdx >= 0 ? yIdx : years.length - 1}
                onIndexChange={i => setY(minYear + i)}
                width={80}
              />
              <Text style={s.wheelLabel}>년</Text>
            </View>

            {/* 월 */}
            <View style={s.wheelCol}>
              <WheelColumn
                items={months}
                selectedIndex={mIdx >= 0 ? mIdx : 0}
                onIndexChange={i => setM(i + 1)}
                width={56}
              />
              <Text style={s.wheelLabel}>월</Text>
            </View>

            {/* 일 */}
            <View style={s.wheelCol}>
              <WheelColumn
                key={`${y}-${m}`}   // 월 바뀌면 재마운트
                items={days}
                selectedIndex={Math.min(dIdx >= 0 ? dIdx : 0, days.length - 1)}
                onIndexChange={i => setD(i + 1)}
                width={56}
              />
              <Text style={s.wheelLabel}>일</Text>
            </View>
          </View>

          {/* 버튼 */}
          <View style={s.btnRow}>
            <Pressable style={s.cancelBtn} onPress={onCancel}>
              <Text style={s.cancelBtnText}>취소</Text>
            </Pressable>
            <Pressable style={[s.confirmBtn, { backgroundColor: accentColor }]} onPress={handleConfirm}>
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: N.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 12,
    gap: 16,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: N.gray200,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16, fontFamily: 'BMJUA',
    color: N.gray800, textAlign: 'center',
  },
  wheelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 0,
  },
  wheelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wheelLabel: {
    fontSize: 14, fontFamily: 'BMJUA',
    color: N.gray500, marginLeft: 2, marginRight: 8,
    marginTop: COL_H / 2 - 8, // 중앙 정렬
  },
  wheelItem: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    fontSize: 16, fontFamily: 'BMJUA',
    color: N.gray400,
  },
  wheelTextSelected: {
    fontSize: 20,
    color: N.gray800,
  },
  btnRow: {
    flexDirection: 'row', gap: 10,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1, borderColor: N.gray200,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15, fontFamily: 'BMJUA', color: N.gray500,
  },
  confirmBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 15, fontFamily: 'BMJUA',
    color: N.white, fontWeight: '700',
  },
});
