import { createAuthStore } from '@we/utils';
import { useShallow } from 'zustand/react/shallow';
import type { AuthUser, AuthTokens } from '@we/utils';

export const useAuthStore = createAuthStore('we-auth');

export const isLoggedIn = () => !!useAuthStore.getState().user;
export const getUser = () => useAuthStore.getState().user;
export const login = (user: AuthUser, tokens?: AuthTokens) => useAuthStore.getState().login(user, tokens);
export const logout = () => useAuthStore.getState().logout();
export const useAuth = () => useAuthStore(useShallow((s) => ({ user: s.user, isLoggedIn: !!s.user })));
