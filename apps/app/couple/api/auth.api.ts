import { $axios } from '../lib/$axios';
import type {
  SignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  AuthTokens,
} from '@we/utils';

/** POST /api/auth/signup */
export const signup = (req: SignupRequest) =>
  $axios.post<AuthTokens>('/api/auth/signup', req);

/** POST /api/auth/login */
export const login = (req: LoginRequest) =>
  $axios.post<AuthTokens>('/api/auth/login', req);

/** POST /api/auth/refresh */
export const refresh = (req: RefreshTokenRequest) =>
  $axios.post<AuthTokens>('/api/auth/refresh', req);

/** POST /api/auth/logout 🔒 */
export const logout = (req: LogoutRequest) =>
  $axios.post<void>('/api/auth/logout', req);
