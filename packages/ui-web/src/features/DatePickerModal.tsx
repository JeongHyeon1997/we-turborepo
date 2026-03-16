import { useState, type CSSProperties } from 'react';

const N = {
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray700: '#374151',
  gray800: '#1f2937', white: '#ffffff',
};

export interface DatePickerModalProps {
  visible: boolean;
  /** 'YYYY-MM-DD' */
  value: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
  title?: string;
  /** max date 'YYYY-MM-DD', defaults to today */
  maxDate?: string;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function DatePickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
  title = '날짜 선택',
  maxDate,
}: DatePickerModalProps) {
  const [selected, setSelected] = useState(value || today());

  if (!visible) return null;

  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.sheet} onClick={e => e.stopPropagation()}>
        <p style={s.title}>{title}</p>

        <input
          type="date"
          value={selected}
          max={maxDate ?? today()}
          onChange={e => setSelected(e.target.value)}
          style={s.input}
        />

        <div style={s.btnRow}>
          <button style={s.cancelBtn} onClick={onCancel}>취소</button>
          <button style={s.confirmBtn} onClick={() => onConfirm(selected)}>확인</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 999,
  },
  sheet: {
    width: '100%', maxWidth: 480,
    backgroundColor: N.white,
    borderRadius: '20px 20px 0 0',
    padding: '24px 24px 32px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  title: {
    margin: 0,
    fontSize: 16, fontWeight: 700,
    color: N.gray800, fontFamily: 'BMJUA, sans-serif',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 18,
    fontFamily: 'BMJUA, sans-serif',
    color: N.gray800,
    border: `1px solid ${N.gray200}`,
    borderRadius: 12,
    backgroundColor: N.gray50,
    outline: 'none',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  btnRow: {
    display: 'flex', gap: 10,
  },
  cancelBtn: {
    flex: 1, padding: '12px 0',
    borderRadius: 12,
    border: `1px solid ${N.gray200}`,
    background: N.white,
    fontSize: 15, fontFamily: 'BMJUA, sans-serif',
    color: N.gray500, cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1, padding: '12px 0',
    borderRadius: 12,
    border: 'none',
    background: '#f4a0a0',
    fontSize: 15, fontFamily: 'BMJUA, sans-serif',
    color: N.white, cursor: 'pointer', fontWeight: 700,
  },
};
