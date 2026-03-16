export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  avatarColor?: string;
  provider: 'kakao' | 'apple' | 'google' | 'email';
}
