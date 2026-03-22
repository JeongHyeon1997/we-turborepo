import { createAuthStore } from '@we/utils';
import type { AuthUser, AuthTokens } from '@we/utils';

// 인메모리 — 앱 재시작 시 초기화 (TODO: AsyncStorage persist 추가)
export const useAuthStore = createAuthStore();

export const isLoggedIn = () => !!useAuthStore.getState().user;
export const getUser = () => useAuthStore.getState().user;
export const login = (user: AuthUser, tokens?: AuthTokens) => useAuthStore.getState().login(user, tokens);
export const logout = () => useAuthStore.getState().logout();
export const useAuth = () => useAuthStore((s) => ({ user: s.user, isLoggedIn: !!s.user }));
