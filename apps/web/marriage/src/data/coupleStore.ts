import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { CoupleConnectionResponse } from '@we/utils';

interface MarriageState {
  connection: CoupleConnectionResponse | null;
  setConnection: (c: CoupleConnectionResponse | null) => void;
}

export const useMarriageStore = create<MarriageState>()((set) => ({
  connection: null,
  setConnection: (connection) => set({ connection }),
}));

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const setConnection = (c: CoupleConnectionResponse | null) =>
  useMarriageStore.getState().setConnection(c);
export const getConnection = () => useMarriageStore.getState().connection;
export const useCoupleConnectionResponse = () =>
  useMarriageStore(useShallow((s) => ({ connection: s.connection, setConnection: s.setConnection })));
