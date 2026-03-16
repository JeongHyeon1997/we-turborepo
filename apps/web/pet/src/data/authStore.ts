import { useState, useEffect } from 'react';
import type { AuthUser } from '@we/utils';

const KEY = 'we_auth_user';

// localStorage에서 초기값 복원
function load(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

let _user: AuthUser | null = load();
const _subs = new Set<() => void>();
function notify() { _subs.forEach(fn => fn()); }

export function login(user: AuthUser) {
  _user = user;
  localStorage.setItem(KEY, JSON.stringify(user));
  notify();
}

export function logout() {
  _user = null;
  localStorage.removeItem(KEY);
  notify();
}

export function isLoggedIn(): boolean { return _user !== null; }
export function getUser(): AuthUser | null { return _user; }

export function useAuth() {
  const [user, setUser] = useState(_user);
  useEffect(() => {
    const update = () => setUser(_user);
    _subs.add(update);
    return () => { _subs.delete(update); };
  }, []);
  return { user, isLoggedIn: !!user };
}
