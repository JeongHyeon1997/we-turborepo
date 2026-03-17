import type { Timestamps } from './common.types';

// ─── Base (DB Table: users) ───────────────────────────────────────────────────

export interface UserBase extends Timestamps {
  id: string;
  name: string;
  email: string | null;
  avatarColor: string;
  provider: 'kakao' | 'apple' | 'google' | 'email';
  providerUserId: string | null;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** POST /auth/login (이메일) */
export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /auth/login (소셜) */
export interface OAuthLoginRequest {
  provider: 'kakao' | 'apple' | 'google';
  accessToken: string;
}

/** POST /auth/signup */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  avatarColor?: string;
}

/** POST /auth/refresh */
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** 만료까지 남은 시간 (초) — 서버 응답 기준 */
  expiresIn: number;
}

/** POST /auth/login, /auth/refresh 응답 */
export interface LoginResponse extends AuthTokens {
  user: UserResponse;
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

/** GET /users/me 응답 */
export type UserResponse = Omit<UserBase, 'providerUserId'>;

/** PUT /users/me 요청 */
export interface UpdateUserRequest {
  name?: string;
  avatarColor?: string;
}

/** PUT /users/me 응답 */
export type UpdateUserResponse = UserResponse;
