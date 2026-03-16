import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { petColors } from '@we/utils';
import type { FamilyMember } from '@we/utils';

const ACCENT   = '#97A4D9';
const MY_CODE  = 'PET-3821';

const MEMBER_COLORS = ['#97A4D9', '#f4a0a0', '#85c1a0', '#f0b86e', '#c9a0e8', '#80c8e0'];

function resolveMember(code: string): FamilyMember {
  const idx = code.charCodeAt(code.length - 1) % MEMBER_COLORS.length;
  return { id: code, name: '가족', avatarColor: MEMBER_COLORS[idx] };
}

interface Props {
  onCodeEntered: (member: FamilyMember) => void;
}

export function FamilyConnectScreen({ onCodeEntered }: Props) {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied]       = useState(false);
  const [error, setError]         = useState('');

  function handleSubmit() {
    const code = inputCode.trim().toUpperCase();
    if (!code) { setError('코드를 입력해주세요.'); return; }
    if (code === MY_CODE) { setError('내 코드는 입력할 수 없어요.'); return; }
    setError('');
    onCodeEntered(resolveMember(code));
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <View style={s.hero}>
        <Text style={s.heroEmoji}>🐾</Text>
        <Text style={s.heroTitle}>가족을 초대해주세요</Text>
        <Text style={s.heroSub}>함께 일기를 작성하려면 가족 연결이 필요합니다.</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>내 초대 코드</Text>
        <View style={s.codeBox}>
          <Text style={s.codeText}>{MY_CODE}</Text>
          <Pressable
            style={[s.copyBtn, copied && { backgroundColor: petColors.surface }]}
            onPress={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          >
            <Text style={[s.copyBtnText, { color: copied ? petColors.gray700 : ACCENT }]}>
              {copied ? '복사됨 ✓' : '복사'}
            </Text>
          </Pressable>
        </View>
        <Text style={s.codeHint}>위 코드를 가족에게 공유하세요.</Text>
      </View>

      <View style={s.divider}>
        <View style={s.dividerLine} />
        <Text style={s.dividerText}>또는</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>가족 초대 코드 입력</Text>
        <TextInput
          style={[s.input, error ? { borderColor: '#ef4444' } : {}]}
          placeholder="예: PET-1234"
          placeholderTextColor={petColors.gray300}
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
        style={({ pressed }) => [s.submitBtn, pressed && { opacity: 0.85 }]}
        onPress={handleSubmit}
      >
        <Text style={s.submitBtnText}>코드 확인하기 →</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: petColors.gray50 },
  container: { padding: 24, gap: 24 },
  hero: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 20, fontFamily: 'BMJUA', color: petColors.gray900 },
  heroSub: { fontSize: 13, fontFamily: 'BMHANNAPro', color: petColors.gray500, textAlign: 'center' },
  section: { gap: 8 },
  sectionLabel: { fontSize: 13, fontFamily: 'BMJUA', color: petColors.gray600 },
  codeBox: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    backgroundColor: petColors.white,
    borderRadius: 14, borderWidth: 1, borderColor: petColors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  codeText: { flex: 1, fontSize: 22, fontFamily: 'BMJUA', letterSpacing: 2, color: ACCENT },
  copyBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
    backgroundColor: ACCENT + '22',
  },
  copyBtnText: { fontSize: 13, fontFamily: 'BMJUA' },
  codeHint: { fontSize: 12, fontFamily: 'BMHANNAPro', color: petColors.gray400 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: petColors.gray100 },
  dividerText: { fontSize: 12, color: petColors.gray400 },
  input: {
    padding: 14, fontSize: 16, fontFamily: 'BMJUA',
    borderRadius: 14, borderWidth: 1, borderColor: petColors.gray200,
    backgroundColor: petColors.white,
    letterSpacing: 1, color: petColors.gray800,
  },
  errorText: { fontSize: 12, fontFamily: 'BMHANNAPro', color: '#ef4444' },
  submitBtn: {
    padding: 16, borderRadius: 16,
    backgroundColor: ACCENT, alignItems: 'center', marginTop: 8,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  submitBtnText: { fontSize: 16, fontFamily: 'BMJUA', color: petColors.white },
});
