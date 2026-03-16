import { useState } from 'react';
import type { CSSProperties } from 'react';

const REASONS = [
  '스팸 / 광고',
  '욕설 / 혐오 표현',
  '성적인 내용',
  '개인정보 침해',
  '거짓 정보 / 사기',
  '기타',
];

const N = {
  white: '#ffffff',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
  red: '#ef4444',
};

export interface ReportModalProps {
  visible: boolean;
  targetType: 'post' | 'comment';
  accentColor?: string;
  onSubmit: (reasons: string[], customText: string) => void;
  onClose: () => void;
}

export function ReportModal({ visible, targetType, accentColor = '#f4a0a0', onSubmit, onClose }: ReportModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState('');
  const [done, setDone] = useState(false);

  if (!visible) return null;

  function toggle(reason: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      return next;
    });
  }

  function handleSubmit() {
    if (selected.size === 0 && !custom.trim()) return;
    onSubmit([...selected], custom.trim());
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setSelected(new Set());
      setCustom('');
      onClose();
    }, 1800);
  }

  function handleClose() {
    setSelected(new Set());
    setCustom('');
    setDone(false);
    onClose();
  }

  const canSubmit = selected.size > 0 || custom.trim().length > 0;

  return (
    <div style={s.overlay} onClick={handleClose}>
      <div style={s.sheet} onClick={e => e.stopPropagation()}>
        {done ? (
          <div style={s.doneWrap}>
            <span style={{ fontSize: 40 }}>✅</span>
            <p style={s.doneTitle}>신고가 접수되었어요</p>
            <p style={s.doneSub}>검토 후 조치하겠습니다.</p>
          </div>
        ) : (
          <>
            <div style={s.header}>
              <span style={{ fontSize: 20 }}>🚨</span>
              <p style={s.title}>{targetType === 'post' ? '게시글' : '댓글'} 신고</p>
              <button style={s.closeBtn} onClick={handleClose}>✕</button>
            </div>
            <p style={s.subtitle}>신고 사유를 선택해주세요 (중복 선택 가능)</p>

            <div style={s.reasonList}>
              {REASONS.map(reason => {
                const checked = selected.has(reason);
                return (
                  <button
                    key={reason}
                    style={{
                      ...s.reasonRow,
                      ...(checked ? { borderColor: accentColor, backgroundColor: accentColor + '12' } : {}),
                    }}
                    onClick={() => toggle(reason)}
                  >
                    <span style={{
                      ...s.checkbox,
                      ...(checked ? { backgroundColor: accentColor, borderColor: accentColor } : {}),
                    }}>
                      {checked && <span style={s.checkmark}>✓</span>}
                    </span>
                    <span style={{ ...s.reasonText, color: checked ? accentColor : N.gray700 }}>
                      {reason}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={s.customLabel}>직접 입력 (선택)</label>
              <textarea
                style={s.customInput}
                placeholder="신고 내용을 직접 입력해주세요..."
                value={custom}
                onChange={e => setCustom(e.target.value)}
                rows={3}
              />
            </div>

            <div style={s.btnRow}>
              <button style={s.cancelBtn} onClick={handleClose}>취소</button>
              <button
                style={{
                  ...s.submitBtn,
                  backgroundColor: canSubmit ? N.red : N.gray200,
                  cursor: canSubmit ? 'pointer' : 'default',
                }}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                신고하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 1000,
  },
  sheet: {
    backgroundColor: N.white,
    borderRadius: '20px 20px 0 0',
    padding: '20px 20px 32px',
    width: '100%', maxWidth: 480,
    maxHeight: '90vh', overflowY: 'auto',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1, margin: 0, fontSize: 17, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: N.gray900,
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: N.gray400, padding: '4px 8px',
  },
  subtitle: {
    margin: '0 0 14px', fontSize: 13, color: N.gray500,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  reasonList: { display: 'flex', flexDirection: 'column', gap: 8 },
  reasonRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '11px 14px', borderRadius: 10,
    border: `1.5px solid ${N.gray200}`, background: N.white,
    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
    width: '100%', boxSizing: 'border-box',
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    border: `2px solid ${N.gray300}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  checkmark: { fontSize: 12, color: N.white, fontWeight: 700 },
  reasonText: { fontSize: 14, fontFamily: 'BMHANNAPro, sans-serif' },
  customLabel: {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: N.gray500, marginBottom: 6,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  customInput: {
    width: '100%', padding: '12px 14px',
    borderRadius: 10, border: `1px solid ${N.gray200}`,
    fontSize: 13, fontFamily: 'BMHANNAPro, sans-serif',
    resize: 'vertical', outline: 'none',
    boxSizing: 'border-box', color: N.gray700,
  },
  btnRow: { display: 'flex', gap: 10, marginTop: 16 },
  cancelBtn: {
    flex: 1, padding: '13px 0', borderRadius: 12,
    border: `1px solid ${N.gray200}`, background: N.white,
    fontSize: 14, fontFamily: 'BMJUA, sans-serif',
    color: N.gray600, cursor: 'pointer',
  },
  submitBtn: {
    flex: 2, padding: '13px 0', borderRadius: 12,
    border: 'none', fontSize: 14, fontFamily: 'BMJUA, sans-serif',
    color: N.white,
  },
  doneWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '32px 20px', gap: 10,
  },
  doneTitle: {
    margin: 0, fontSize: 17, fontWeight: 700,
    fontFamily: 'BMJUA, sans-serif', color: N.gray900,
  },
  doneSub: {
    margin: 0, fontSize: 13, color: N.gray500,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
};
