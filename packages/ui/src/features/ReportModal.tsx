import { useState } from 'react';
import {
  Modal, View, Text, TextInput, ScrollView,
  Pressable, StyleSheet,
} from 'react-native';

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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {done ? (
              <View style={styles.doneWrap}>
                <Text style={{ fontSize: 40 }}>✅</Text>
                <Text style={[styles.doneTitle, { fontFamily: 'BMJUA' }]}>신고가 접수되었어요</Text>
                <Text style={[styles.doneSub, { fontFamily: 'BMHANNAPro' }]}>검토 후 조치하겠습니다.</Text>
              </View>
            ) : (
              <>
                <View style={styles.header}>
                  <Text style={{ fontSize: 20 }}>🚨</Text>
                  <Text style={[styles.title, { fontFamily: 'BMJUA' }]}>
                    {targetType === 'post' ? '게시글' : '댓글'} 신고
                  </Text>
                  <Pressable style={styles.closeBtn} onPress={handleClose} hitSlop={8}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </Pressable>
                </View>
                <Text style={[styles.subtitle, { fontFamily: 'BMHANNAPro' }]}>
                  신고 사유를 선택해주세요 (중복 선택 가능)
                </Text>

                <View style={styles.reasonList}>
                  {REASONS.map(reason => {
                    const checked = selected.has(reason);
                    return (
                      <Pressable
                        key={reason}
                        style={[
                          styles.reasonRow,
                          checked && { borderColor: accentColor, backgroundColor: accentColor + '12' },
                        ]}
                        onPress={() => toggle(reason)}
                      >
                        <View style={[
                          styles.checkbox,
                          checked && { backgroundColor: accentColor, borderColor: accentColor },
                        ]}>
                          {checked && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={[
                          styles.reasonText,
                          { fontFamily: 'BMHANNAPro', color: checked ? accentColor : N.gray700 },
                        ]}>
                          {reason}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={{ marginTop: 12 }}>
                  <Text style={[styles.customLabel, { fontFamily: 'BMHANNAPro' }]}>직접 입력 (선택)</Text>
                  <TextInput
                    style={[styles.customInput, { fontFamily: 'BMHANNAPro' }]}
                    placeholder="신고 내용을 직접 입력해주세요..."
                    placeholderTextColor={N.gray400}
                    value={custom}
                    onChangeText={setCustom}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.btnRow}>
                  <Pressable style={styles.cancelBtn} onPress={handleClose}>
                    <Text style={[styles.cancelText, { fontFamily: 'BMJUA' }]}>취소</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.submitBtn, { backgroundColor: canSubmit ? N.red : N.gray200 }]}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                  >
                    <Text style={[styles.submitText, { fontFamily: 'BMJUA' }]}>신고하기</Text>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: N.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 32,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 4,
  },
  title: { flex: 1, fontSize: 17, color: N.gray900 },
  closeBtn: { padding: 4 },
  closeBtnText: { fontSize: 16, color: N.gray400 },
  subtitle: { fontSize: 13, color: N.gray500, marginBottom: 14 },
  reasonList: { gap: 8 },
  reasonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 10,
    borderWidth: 1.5, borderColor: N.gray200,
    backgroundColor: N.white,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: N.gray300,
    alignItems: 'center', justifyContent: 'center',
  },
  checkmark: { fontSize: 12, color: N.white, fontWeight: '700' },
  reasonText: { fontSize: 14, flex: 1 },
  customLabel: {
    fontSize: 12, fontWeight: '600',
    color: N.gray500, marginBottom: 6,
  },
  customInput: {
    paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 10, borderWidth: 1, borderColor: N.gray200,
    fontSize: 13, color: N.gray700, minHeight: 80,
  },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 12,
    borderWidth: 1, borderColor: N.gray200, backgroundColor: N.white,
    alignItems: 'center',
  },
  cancelText: { fontSize: 14, color: N.gray600 },
  submitBtn: {
    flex: 2, paddingVertical: 13, borderRadius: 12, alignItems: 'center',
  },
  submitText: { fontSize: 14, color: N.white },
  doneWrap: { alignItems: 'center', padding: 32, gap: 10 },
  doneTitle: { fontSize: 17, color: N.gray900 },
  doneSub: { fontSize: 13, color: N.gray500 },
});
