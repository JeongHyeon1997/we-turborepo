import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { AuthTokens } from '../types';

interface AuthStoreState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
}

const REFRESH_THRESHOLD_MS = 5 * 60 * 1_000;

/**
 * axios 인스턴스 팩토리
 * - 만료 5분 전 선제적 토큰 갱신
 * - 동시 요청 시 중복 refresh 방지
 * - 401 응답 시 재시도 후 실패하면 logout
 *
 * @param baseURL  VITE_API_URL 또는 EXPO_PUBLIC_API_URL 값을 전달
 * @param getAuthState  useAuthStore.getState 콜백
 */
export function createAxiosClient(
  baseURL: string,
  getAuthState: () => AuthStoreState,
) {
  const _plain = axios.create({ baseURL });
  let _refreshing: Promise<string | null> | null = null;

  async function refreshAccessToken(): Promise<string | null> {
    if (_refreshing) return _refreshing;

    _refreshing = (async () => {
      const { refreshToken, setTokens, logout } = getAuthState();
      if (!refreshToken) { logout(); return null; }

      try {
        const { data } = await _plain.post<AuthTokens>('/api/auth/refresh', { refreshToken });
        setTokens(data);
        return data.accessToken;
      } catch {
        logout();
        return null;
      }
    })().finally(() => { _refreshing = null; });

    return _refreshing;
  }

  const $axios = axios.create({
    baseURL,
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
  });

  $axios.interceptors.request.use(async (config) => {
    const { accessToken, expiresAt } = getAuthState();

    if (accessToken && expiresAt && expiresAt - Date.now() < REFRESH_THRESHOLD_MS) {
      const newToken = await refreshAccessToken();
      if (newToken) config.headers.Authorization = `Bearer ${newToken}`;
      return config;
    }

    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  $axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status !== 401) return Promise.reject(error);

      const original = error.config as AxiosRequestConfig & { _retry?: boolean };
      if (original._retry) {
        getAuthState().logout();
        return Promise.reject(error);
      }
      original._retry = true;

      const newToken = await refreshAccessToken();
      if (!newToken) return Promise.reject(error);

      if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
      return $axios(original);
    },
  );

  return $axios;
}
