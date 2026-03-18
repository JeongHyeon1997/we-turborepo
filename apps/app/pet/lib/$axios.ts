import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../data/authStore';
import type { AuthTokens } from '@we/utils';

/** 만료 5분 전 선제적 갱신 */
const REFRESH_THRESHOLD_MS = 5 * 60 * 1_000;

/** refresh 전용 plain axios — interceptor 무한 루프 방지 */
const _plain = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

/** 진행 중인 refresh Promise — 동시 요청 시 중복 호출 방지 */
let _refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (_refreshing) return _refreshing;

  _refreshing = (async () => {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    if (!refreshToken) { logout(); return null; }

    try {
      const { data } = await _plain.post<AuthTokens>(
        '/api/auth/refresh',
        { refreshToken },
      );
      setTokens(data);
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  })().finally(() => { _refreshing = null; });

  return _refreshing;
}

export const $axios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: 만료 임박 시 선제적 갱신 + 토큰 주입 ────────────────────────────
$axios.interceptors.request.use(async (config) => {
  const { accessToken, expiresAt } = useAuthStore.getState();

  if (accessToken && expiresAt && expiresAt - Date.now() < REFRESH_THRESHOLD_MS) {
    const newToken = await refreshAccessToken();
    if (newToken) config.headers.Authorization = `Bearer ${newToken}`;
    return config;
  }

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// ── Response: 401 → 토큰 갱신 후 원래 요청 재시도 ────────────────────────────
$axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status !== 401) return Promise.reject(error);

    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (original._retry) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }
    original._retry = true;

    const newToken = await refreshAccessToken();
    if (!newToken) return Promise.reject(error);

    if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
    return $axios(original);
  },
);
