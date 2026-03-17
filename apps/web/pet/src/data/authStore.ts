import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, AuthTokens } from '@we/utils';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** ms timestamp — 만료 시각 */
  expiresAt: number | null;
  login: (user: AuthUser, tokens?: AuthTokens) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,

      login: (user, tokens) =>
        set({
          user,
          accessToken: tokens?.accessToken ?? null,
          refreshToken: tokens?.refreshToken ?? null,
          expiresAt: tokens ? Date.now() + tokens.expiresIn * 1_000 : null,
        }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, expiresAt: null }),

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: Date.now() + tokens.expiresIn * 1_000,
        }),
    }),
    {
      name: 'we-auth',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        expiresAt: s.expiresAt,
      }),
    },
  ),
);

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const isLoggedIn = () => !!useAuthStore.getState().user;
export const getUser = () => useAuthStore.getState().user;
export const login = (user: AuthUser, tokens?: AuthTokens) =>
  useAuthStore.getState().login(user, tokens);
export const logout = () => useAuthStore.getState().logout();
export const useAuth = () =>
  useAuthStore((s) => ({ user: s.user, isLoggedIn: !!s.user }));
