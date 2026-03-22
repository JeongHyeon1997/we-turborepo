import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { AuthUser } from '../auth';
import type { AuthTokens } from '../types';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** ms timestamp — 만료 시각 */
  expiresAt: number | null;
  login: (user: AuthUser, tokens?: AuthTokens) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
}

const authStateCreator: StateCreator<AuthState> = (set) => ({
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
});

/**
 * Zustand authStore 팩토리
 * @param persistKey  전달 시 localStorage 영속화 (Web), 미전달 시 인메모리 (Native)
 */
export function createAuthStore(persistKey?: string) {
  if (persistKey) {
    return create<AuthState>()(
      persist(authStateCreator, {
        name: persistKey,
        partialize: (s) => ({
          user: s.user,
          accessToken: s.accessToken,
          refreshToken: s.refreshToken,
          expiresAt: s.expiresAt,
        }),
      }),
    );
  }
  return create<AuthState>()(authStateCreator);
}
