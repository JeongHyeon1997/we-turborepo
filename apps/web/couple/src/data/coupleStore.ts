import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { CoupleConnectionResponse } from '@we/utils';

interface CoupleState {
  connection: CoupleConnectionResponse | null;
  setConnection: (c: CoupleConnectionResponse | null) => void;
}

export const useCoupleStore = create<CoupleState>()((set) => ({
  connection: null,
  setConnection: (connection) => set({ connection }),
}));

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const setConnection = (c: CoupleConnectionResponse | null) =>
  useCoupleStore.getState().setConnection(c);
export const getConnection = () => useCoupleStore.getState().connection;
export const useCoupleConnectionResponse = () =>
  useCoupleStore(useShallow((s) => ({ connection: s.connection, setConnection: s.setConnection })));
