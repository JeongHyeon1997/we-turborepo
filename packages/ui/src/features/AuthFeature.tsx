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
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray700: '#374151',
};

export interface AuthFeatureProps {
  onLogin: (user: AuthUser) => void;
  accentColor?: string;
}

export function AuthFeature({ onLogin, accentColor = '#f4a0a0' }: AuthFeatureProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { fontFamily: 'BMJUA' }]}>로그인 / 회원가입</Text>
      <Text style={[styles.sub, { fontFamily: 'BMHANNAPro' }]}>
        가입하면 데이터가 안전하게 백업돼요
      </Text>

      {/* 카카오 */}
      <Pressable
        style={[styles.btn, { backgroundColor: '#FEE500' }]}
        onPress={() => onLogin({ id: 'mock-kakao', name: '카카오유저', provider: 'kakao', avatarColor: accentColor })}
      >
        <Text style={[styles.btnText, { fontFamily: 'BMJUA', color: '#3C1E1E' }]}>
          카카오로 계속하기
        </Text>
      </Pressable>

      {/* 애플 */}
      <Pressable
        style={[styles.btn, { backgroundColor: '#000' }]}
        onPress={() => onLogin({ id: 'mock-apple', name: '애플유저', provider: 'apple', avatarColor: accentColor })}
      >
        <Text style={[styles.btnText, { fontFamily: 'BMJUA', color: N.white }]}>
          Apple로 계속하기
        </Text>
      </Pressable>

      {/* 구글 */}
      <Pressable
        style={[styles.btn, { backgroundColor: N.white, borderWidth: 1, borderColor: N.gray200 }]}
        onPress={() => onLogin({ id: 'mock-google', name: '구글유저', provider: 'google', avatarColor: accentColor })}
      >
        <Text style={[styles.btnText, { fontFamily: 'BMJUA', color: N.gray700 }]}>
          Google로 계속하기
        </Text>
      </Pressable>

      {/* 또는 divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={[styles.dividerText, { fontFamily: 'BMHANNAPro' }]}>또는</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* 이메일 / 비밀번호 */}
      <TextInput
        style={[styles.input, { fontFamily: 'BMHANNAPro' }]}
        placeholder="이메일"
        placeholderTextColor={N.gray400}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { fontFamily: 'BMHANNAPro' }]}
        placeholder="비밀번호"
        placeholderTextColor={N.gray400}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* 이메일로 계속 */}
      <Pressable
        style={[styles.btn, { backgroundColor: accentColor }]}
        onPress={() => onLogin({ id: 'mock-email', name: '이메일유저', provider: 'email', email, avatarColor: accentColor })}
      >
        <Text style={[styles.btnText, { fontFamily: 'BMJUA', color: N.white }]}>
          이메일로 계속
        </Text>
      </Pressable>

      <View style={styles.separator} />

      {/* 개발용 빠른 로그인 */}
      <Pressable
        style={[styles.btn, { backgroundColor: N.white, borderWidth: 1, borderColor: N.gray200 }]}
        onPress={() => onLogin({ id: 'dev-001', name: '테스트유저', avatarColor: accentColor, provider: 'email' })}
      >
        <Text style={[styles.btnText, { fontFamily: 'BMHANNAPro', color: N.gray500, fontSize: 13 }]}>
          🛠 개발용 빠른 로그인
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 32,
    gap: 12,
  },
  title: {
    fontSize: 22,
    color: '#111827',
    marginBottom: 2,
  },
  sub: {
    fontSize: 13,
    color: N.gray500,
    marginBottom: 8,
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: N.gray200,
  },
  dividerText: {
    fontSize: 12,
    color: N.gray400,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: N.gray200,
    fontSize: 14,
    backgroundColor: N.white,
  },
  separator: {
    height: 1,
    backgroundColor: N.gray100,
    marginVertical: 4,
  },
});
