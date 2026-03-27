import { useNavigate } from 'react-router-dom';
import { AuthFeature } from '@we/ui-web';
import { login as storeLogin, useAuthStore } from '../data/authStore';
import { signup as signupApi, login as loginApi } from '../api/auth.api';
import { getMe } from '../api/user.api';

const ACCENT = '#f4a0a0';

export function AuthPage() {
  const navigate = useNavigate();

  async function handleEmailLogin(email: string, password: string) {
    const { data: tokens } = await loginApi({ type: 'email', email, password });
    useAuthStore.getState().setTokens(tokens);
    const { data: profile } = await getMe();
    storeLogin({ id: profile.id, name: profile.nickname, email: profile.email ?? undefined, provider: 'email', avatarColor: ACCENT }, tokens);
    navigate(-1);
  }

  async function handleEmailSignup(nickname: string, email: string, password: string) {
    const { data: tokens } = await signupApi({ email, password, nickname });
    useAuthStore.getState().setTokens(tokens);
    const { data: profile } = await getMe();
    storeLogin({ id: profile.id, name: profile.nickname, email: profile.email ?? undefined, provider: 'email', avatarColor: ACCENT }, tokens);
    navigate(-1);
  }

  return (
    <AuthFeature
      onEmailLogin={handleEmailLogin}
      onEmailSignup={handleEmailSignup}
      accentColor={ACCENT}
      appName="우리, 커플"
    />
  );
}
