import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { AuthUser } from '@we/utils';

const N = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  red: '#ef4444',
};

export interface AuthFeatureProps {
  onLogin: (user: AuthUser) => void;
  accentColor?: string;
  appName?: string;
}

type Mode = 'login' | 'signup';

export function AuthFeature({ onLogin, accentColor = '#f4a0a0', appName }: AuthFeatureProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirm('');
  }

  function handleEmailSubmit() {
    setError('');
    if (mode === 'signup' && !name.trim()) { setError('이름을 입력해주세요'); return; }
    if (!email.includes('@') || !email.includes('.')) { setError('올바른 이메일을 입력해주세요'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return; }
    if (mode === 'signup' && password !== confirm) { setError('비밀번호가 일치하지 않아요'); return; }
    onLogin({
      id: `mock-email-${Date.now()}`,
      name: mode === 'signup' ? name.trim() : '이메일유저',
      provider: 'email',
      email,
      avatarColor: accentColor,
    });
  }

  const accentLight = accentColor + '20';

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">

      {/* ── 상단 인사 ─────────────────────────────── */}
      <View style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: accentLight, borderColor: accentColor + '40' }]}>
          <Text style={{ fontSize: 32 }}>🤝</Text>
        </View>
        <Text style={[styles.heroTitle, { fontFamily: 'BMJUA' }]}>
          {appName ? `${appName}에 오신 걸 환영해요` : '안녕하세요 👋'}
        </Text>
        <Text style={[styles.heroSub, { fontFamily: 'BMHANNAPro' }]}>
          가입하면 데이터가 안전하게 백업돼요
        </Text>
      </View>

      {/* ── 소셜 로그인 ───────────────────────────── */}
      <View style={styles.socialGroup}>
        <SocialButton
          label="카카오로 계속하기"
          bg="#FEE500"
          color="#3C1E1E"
          icon="💬"
          onPress={() => onLogin({ id: 'mock-kakao', name: '카카오유저', provider: 'kakao', avatarColor: accentColor })}
        />
        <SocialButton
          label="Apple로 계속하기"
          bg="#000"
          color={N.white}
          icon="🍎"
          onPress={() => onLogin({ id: 'mock-apple', name: '애플유저', provider: 'apple', avatarColor: accentColor })}
        />
        <SocialButton
          label="Google로 계속하기"
          bg={N.white}
          color={N.gray700}
          icon="G"
          border={N.gray200}
          onPress={() => onLogin({ id: 'mock-google', name: '구글유저', provider: 'google', avatarColor: accentColor })}
        />
      </View>

      {/* ── 구분선 ────────────────────────────────── */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={[styles.dividerText, { fontFamily: 'BMHANNAPro' }]}>또는 이메일로</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* ── 로그인 / 회원가입 탭 ──────────────────── */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tab, mode === 'login' && { ...styles.tabActive, borderBottomColor: accentColor }]}
          onPress={() => switchMode('login')}
        >
          <Text style={[
            styles.tabText,
            { fontFamily: 'BMJUA', color: mode === 'login' ? accentColor : N.gray400 },
          ]}>
            로그인
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === 'signup' && { ...styles.tabActive, borderBottomColor: accentColor }]}
          onPress={() => switchMode('signup')}
        >
          <Text style={[
            styles.tabText,
            { fontFamily: 'BMJUA', color: mode === 'signup' ? accentColor : N.gray400 },
          ]}>
            회원가입
          </Text>
        </Pressable>
      </View>

      {/* ── 폼 ───────────────────────────────────── */}
      <View style={styles.form}>
        {mode === 'signup' && (
          <FormField
            label="이름"
            placeholder="홍길동"
            value={name}
            onChangeText={setName}
            accentColor={accentColor}
          />
        )}
        <FormField
          label="이메일"
          placeholder="hello@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          accentColor={accentColor}
        />
        {/* 비밀번호 */}
        <View>
          <Text style={[styles.fieldLabel, { fontFamily: 'BMHANNAPro' }]}>비밀번호</Text>
          <View style={styles.pwWrap}>
            <TextInput
              style={[styles.input, { fontFamily: 'BMHANNAPro', paddingRight: 48 }]}
              placeholder="6자 이상"
              placeholderTextColor={N.gray400}
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable style={styles.pwToggle} onPress={() => setShowPw(v => !v)}>
              <Text style={{ fontSize: 16 }}>{showPw ? '🙈' : '👁'}</Text>
            </Pressable>
          </View>
        </View>
        {mode === 'signup' && (
          <FormField
            label="비밀번호 확인"
            placeholder="다시 한번 입력"
            secureTextEntry={!showPw}
            value={confirm}
            onChangeText={setConfirm}
            accentColor={accentColor}
          />
        )}

        {/* 에러 */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={[styles.errorText, { fontFamily: 'BMHANNAPro' }]}>{error}</Text>
          </View>
        )}

        {/* 제출 버튼 */}
        <Pressable
          style={[styles.submitBtn, { backgroundColor: accentColor }]}
          onPress={handleEmailSubmit}
        >
          <Text style={[styles.submitText, { fontFamily: 'BMJUA' }]}>
            {mode === 'login' ? '로그인' : '가입하기'}
          </Text>
        </Pressable>

        {mode === 'login' && (
          <Pressable>
            <Text style={[styles.forgotText, { fontFamily: 'BMHANNAPro' }]}>
              비밀번호를 잊으셨나요?
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── 개발용 ────────────────────────────────── */}
      <View style={styles.devSection}>
        <View style={styles.devDivider} />
        <Pressable
          style={styles.devBtn}
          onPress={() => onLogin({ id: 'dev-001', name: '테스트유저', avatarColor: accentColor, provider: 'email' })}
        >
          <Text style={[styles.devText, { fontFamily: 'BMHANNAPro' }]}>
            🛠 개발용 빠른 로그인
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ─── 서브 컴포넌트 ───────────────────────────────────────── */

function SocialButton({
  label, bg, color, icon, border, onPress,
}: {
  label: string; bg: string; color: string; icon: string; border?: string; onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.socialBtn,
        { backgroundColor: bg },
        border ? { borderWidth: 1, borderColor: border } : {},
      ]}
      onPress={onPress}
    >
      <Text style={{ fontSize: 16 }}>{icon}</Text>
      <Text style={[styles.socialBtnText, { fontFamily: 'BMJUA', color }]}>{label}</Text>
    </Pressable>
  );
}

function FormField({
  label, placeholder, keyboardType, autoCapitalize, secureTextEntry, value, onChangeText, accentColor,
}: {
  label: string; placeholder?: string;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
  secureTextEntry?: boolean;
  value: string; onChangeText: (v: string) => void; accentColor: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      <Text style={[styles.fieldLabel, { fontFamily: 'BMHANNAPro' }]}>{label}</Text>
      <TextInput
        style={[styles.input, { fontFamily: 'BMHANNAPro', borderColor: focused ? accentColor : N.gray200 }]}
        placeholder={placeholder}
        placeholderTextColor={N.gray400}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

/* ─── 스타일 ──────────────────────────────────────────────── */

const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, marginBottom: 14,
  },
  heroTitle: {
    fontSize: 20, color: N.gray900, marginBottom: 6,
  },
  heroSub: {
    fontSize: 13, color: N.gray400, textAlign: 'center',
  },
  socialGroup: { gap: 10 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: 12,
  },
  socialBtnText: { fontSize: 15 },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: N.gray200 },
  dividerText: { fontSize: 12, color: N.gray400 },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 2, borderBottomColor: N.gray100,
    marginBottom: 20,
  },
  tab: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
    marginBottom: -2,
  },
  tabActive: {},
  tabText: { fontSize: 15 },
  form: { gap: 12 },
  fieldLabel: {
    fontSize: 12, fontWeight: '600',
    color: N.gray500, marginBottom: 6,
  },
  input: {
    width: '100%', paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 10, borderWidth: 1,
    fontSize: 14, backgroundColor: N.white, color: N.gray800,
  },
  pwWrap: { position: 'relative' },
  pwToggle: {
    position: 'absolute', right: 12, top: 0, bottom: 0,
    justifyContent: 'center', paddingHorizontal: 4,
  },
  errorBox: {
    backgroundColor: '#fef2f2', borderRadius: 8, padding: 10,
  },
  errorText: { fontSize: 12, color: N.red },
  submitBtn: {
    paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4,
  },
  submitText: { fontSize: 16, color: N.white },
  forgotText: {
    fontSize: 12, color: N.gray400, textAlign: 'center',
    textDecorationLine: 'underline',
  },
  devSection: { gap: 10, marginTop: 28 },
  devDivider: { height: 1, backgroundColor: N.gray100 },
  devBtn: {
    borderWidth: 1, borderColor: N.gray200, borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 11, alignItems: 'center',
  },
  devText: { fontSize: 13, color: N.gray400 },
});
