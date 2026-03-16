import { useNavigate } from 'react-router-dom';
import { AuthFeature } from '@we/ui-web';
import type { AuthUser } from '@we/utils';
import { login } from '../data/authStore';

export function AuthPage() {
  const navigate = useNavigate();

  function handleLogin(user: AuthUser) {
    login(user);
    navigate(-1);  // 로그인 후 이전 페이지로
  }

  return <AuthFeature onLogin={handleLogin} accentColor="#97A4D9" appName="우리, 아이" />;
}
