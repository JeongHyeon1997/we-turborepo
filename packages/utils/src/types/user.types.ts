// ─── Base (DB Table: users) ───────────────────────────────────────────────────

export interface UserBase {
  id: string;
  email: string | null;
  nickname: string;
  profileImageUrl: string | null;
  provider: 'GOOGLE' | 'KAKAO' | 'APPLE' | 'NAVER' | 'email';
  createdAt: string;
}

// ─── Auth Requests ────────────────────────────────────────────────────────────

/** POST /api/auth/signup */
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

/** POST /api/auth/login (이메일) */
export interface EmailLoginRequest {
  type: 'email';
  email: string;
  password: string;
}

/** POST /api/auth/login (소셜) */
export interface OAuthLoginRequest {
  type: 'oauth';
  provider: 'GOOGLE' | 'KAKAO' | 'APPLE' | 'NAVER';
  accessToken: string;
}

export type LoginRequest = EmailLoginRequest | OAuthLoginRequest;

/** POST /api/auth/refresh */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** POST /api/auth/logout */
export interface LogoutRequest {
  refreshToken: string;
}

// ─── Auth Response ────────────────────────────────────────────────────────────

/** POST /api/auth/signup, /api/auth/login, /api/auth/refresh 응답 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** 만료까지 남은 시간 (초) — 서버 응답 기준 */
  expiresIn: number;
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

/** GET /api/users/me 응답 */
export type UserResponse = UserBase;

/** PUT /api/users/me 요청 */
export interface UpdateUserRequest {
  nickname?: string | null;
  profileImageUrl?: string | null;
}

/** PUT /api/users/me 응답 */
export type UpdateUserResponse = UserResponse;
