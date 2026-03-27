import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform,
} from 'react-native';
import { coupleColors } from '@we/utils';

interface CouplePartner { id: string; name: string; avatarColor: string; }

const ACCENT    = '#f4a0a0';
const MY_CODE   = 'WE-7429';

function resolvePartner(code: string): CouplePartner {
  return { id: code, name: '다솔이', avatarColor: '#FF6B9D' };
}

interface Props {
  onCodeEntered: (partner: CouplePartner) => void;
}

export function CoupleConnectScreen({ onCodeEntered }: Props) {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied]       = useState(false);
  const [error, setError]         = useState('');

  function handleSubmit() {
    const code = inputCode.trim().toUpperCase();
    if (!code) { setError('코드를 입력해주세요.'); return; }
    if (code === MY_CODE) { setError('내 코드는 입력할 수 없어요.'); return; }
    setError('');
    onCodeEntered(resolvePartner(code));
  }

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* 히어로 */}
      <View style={s.hero}>
        <Text style={s.heroEmoji}>💕</Text>
        <Text style={s.heroTitle}>상대방과 연결해주세요</Text>
        <Text style={s.heroSub}>함께 일기를 작성하려면 연결이 필요합니다.</Text>
      </View>

      {/* 내 코드 */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>내 초대 코드</Text>
        <View style={s.codeBox}>
          <Text style={s.codeText}>{MY_CODE}</Text>
          <Pressable
            style={[s.copyBtn, copied && { backgroundColor: coupleColors.primary200 }]}
            onPress={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          >
            <Text style={[s.copyBtnText, { color: copied ? coupleColors.gray700 : ACCENT }]}>
              {copied ? '복사됨 ✓' : '복사'}
            </Text>
          </Pressable>
        </View>
        <Text style={s.codeHint}>위 코드를 상대방에게 공유하세요.</Text>
      </View>

      {/* 구분선 */}
      <View style={s.divider}>
        <View style={s.dividerLine} />
        <Text style={s.dividerText}>또는</Text>
        <View style={s.dividerLine} />
      </View>

      {/* 코드 입력 */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>상대방 초대 코드 입력</Text>
        <TextInput
          style={[s.input, error ? { borderColor: '#ef4444' } : {}]}
          placeholder="예: WE-1234"
          placeholderTextColor={coupleColors.gray300}
          value={inputCode}
          onChangeText={t => { setInputCode(t); setError(''); }}
          autoCapitalize="characters"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          maxLength={10}
        />
        {!!error && <Text style={s.errorText}>{error}</Text>}
      </View>

      <Pressable
        style={({ pressed }) => [s.submitBtn, pressed && s.submitBtnPressed]}
        onPress={handleSubmit}
      >
        <Text style={s.submitBtnText}>코드 확인하기 →</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: coupleColors.gray50 },
  container: { padding: 24, gap: 24 },
  hero: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 20, fontFamily: 'BMJUA', color: coupleColors.gray900 },
  heroSub: {
    fontSize: 13, fontFamily: 'BMHANNAPro',
    color: coupleColors.gray500, textAlign: 'center',
  },
  section: { gap: 8 },
  sectionLabel: { fontSize: 13, fontFamily: 'BMJUA', color: coupleColors.gray600 },
  codeBox: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14,
    backgroundColor: coupleColors.white,
    borderRadius: 14, borderWidth: 1, borderColor: coupleColors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  codeText: {
    flex: 1, fontSize: 22, fontFamily: 'BMJUA',
    letterSpacing: 2, color: ACCENT,
  },
  copyBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: ACCENT + '22',
  },
  copyBtnText: { fontSize: 13, fontFamily: 'BMJUA' },
  codeHint: { fontSize: 12, fontFamily: 'BMHANNAPro', color: coupleColors.gray400 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: coupleColors.gray100 },
  dividerText: { fontSize: 12, color: coupleColors.gray400 },
  input: {
    padding: 14, fontSize: 16, fontFamily: 'BMJUA',
    borderRadius: 14, borderWidth: 1, borderColor: coupleColors.gray200,
    backgroundColor: coupleColors.white,
    letterSpacing: 1, color: coupleColors.gray800,
  },
  errorText: { fontSize: 12, fontFamily: 'BMHANNAPro', color: '#ef4444' },
  submitBtn: {
    padding: 16, borderRadius: 16,
    backgroundColor: ACCENT, alignItems: 'center', marginTop: 8,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  submitBtnPressed: { opacity: 0.85 },
  submitBtnText: { fontSize: 16, fontFamily: 'BMJUA', color: coupleColors.white },
});
