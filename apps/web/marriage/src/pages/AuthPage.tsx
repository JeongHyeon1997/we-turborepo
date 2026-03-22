import { useNavigate } from 'react-router-dom';
import { AuthFeature } from '@we/ui-web';
import type { AuthUser } from '@we/utils';
import { login } from '../data/authStore';

export function AuthPage() {
  const navigate = useNavigate();

  function handleLogin(user: AuthUser) {
    login(user);
    navigate(-1);
  }

  return <AuthFeature onLogin={handleLogin} accentColor="#c9a96e" appName="우리, 결혼" />;
}
