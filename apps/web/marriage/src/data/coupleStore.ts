import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { CoupleConnection } from '@we/utils';

interface MarriageState {
  connection: CoupleConnection | null;
  setConnection: (c: CoupleConnection | null) => void;
}

export const useMarriageStore = create<MarriageState>()((set) => ({
  connection: null,
  setConnection: (connection) => set({ connection }),
}));

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const setConnection = (c: CoupleConnection | null) =>
  useMarriageStore.getState().setConnection(c);
export const getConnection = () => useMarriageStore.getState().connection;
export const useCoupleConnection = () =>
  useMarriageStore(useShallow((s) => ({ connection: s.connection, setConnection: s.setConnection })));
