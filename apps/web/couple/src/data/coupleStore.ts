import { useState, useEffect } from 'react';
import type { CoupleConnection } from '@we/utils';

let _connection: CoupleConnection | null = null;
const _subs = new Set<() => void>();

export function setConnection(c: CoupleConnection | null) {
  _connection = c;
  _subs.forEach(fn => fn());
}

export function getConnection() {
  return _connection;
}

export function useCoupleConnection() {
  const [connection, setConn] = useState(_connection);
  useEffect(() => {
    const update = () => setConn(_connection ? { ..._connection } : null);
    _subs.add(update);
    return () => { _subs.delete(update); };
  }, []);
  return { connection, setConnection };
}
