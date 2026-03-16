import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const N = {
  white: '#ffffff',
  gray200: '#e5e7eb',
  gray500: '#6b7280',
  black45: 'rgba(0,0,0,0.45)',
};

export interface AuthPromptModalProps {
  visible: boolean;
  message?: string;
  accentColor?: string;
  onLoginPress: () => void;
  onClose: () => void;
}

export function AuthPromptModal({
  visible,
  message = '회원 전용 기능이에요',
  accentColor = '#f4a0a0',
  onLoginPress,
  onClose,
}: AuthPromptModalProps) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { paddingBottom: Platform.OS === 'ios' ? 40 : 28 },
          ]}
          onPress={() => {}}
        >
          <View style={styles.handle} />
          <Text style={styles.lock}>🔐</Text>
          <Text style={[styles.message, { fontFamily: 'BMJUA' }]}>{message}</Text>
          <Text style={[styles.sub, { fontFamily: 'BMHANNAPro' }]}>
            {'가입하면 데이터가 백업되고\n더 많은 기능을 쓸 수 있어요'}
          </Text>
          <Pressable
            style={[styles.btnPrimary, { backgroundColor: accentColor }]}
            onPress={onLoginPress}
          >
            <Text style={[styles.btnPrimaryText, { fontFamily: 'BMJUA' }]}>로그인 / 회원가입</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={onClose}>
            <Text style={[styles.btnSecondaryText, { fontFamily: 'BMHANNAPro' }]}>나중에</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: N.black45,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: N.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: N.gray200,
    marginBottom: 8,
  },
  lock: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: 4,
  },
  message: {
    fontSize: 18,
    color: '#111827',
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    color: N.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: N.white,
    fontSize: 15,
  },
  btnSecondary: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: N.gray200,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: N.gray500,
    fontSize: 14,
  },
});
