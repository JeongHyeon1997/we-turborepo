import { useState, useEffect } from 'react';
import type { AuthUser } from '@we/utils';

// AsyncStorage 없이 인메모리 스토어 (앱 재시작 시 초기화)
// TODO: AsyncStorage 추가 시 @react-native-async-storage/async-storage 로 교체
let _user: AuthUser | null = null;
const _subs = new Set<() => void>();

function notify() { _subs.forEach(fn => fn()); }

export function login(user: AuthUser) {
  _user = user;
  notify();
}

export function logout() {
  _user = null;
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
