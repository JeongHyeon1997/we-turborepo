import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { CoupleConnection } from '@we/utils';

interface CoupleState {
  connection: CoupleConnection | null;
  setConnection: (c: CoupleConnection | null) => void;
}

export const useCoupleStore = create<CoupleState>()((set) => ({
  connection: null,
  setConnection: (connection) => set({ connection }),
}));

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const setConnection = (c: CoupleConnection | null) =>
  useCoupleStore.getState().setConnection(c);
export const getConnection = () => useCoupleStore.getState().connection;
export const useCoupleConnection = () =>
  useCoupleStore(useShallow((s) => ({ connection: s.connection, setConnection: s.setConnection })));
