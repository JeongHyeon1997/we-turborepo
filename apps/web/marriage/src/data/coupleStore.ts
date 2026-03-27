import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { MarriageConnectionResponse } from '@we/utils';

interface MarriageState {
  connection: MarriageConnectionResponse | null;
  setConnection: (c: MarriageConnectionResponse | null) => void;
}

export const useMarriageStore = create<MarriageState>()((set) => ({
  connection: null,
  setConnection: (connection) => set({ connection }),
}));

export const setConnection = (c: MarriageConnectionResponse | null) =>
  useMarriageStore.getState().setConnection(c);
export const getConnection = () => useMarriageStore.getState().connection;
export const useCoupleConnectionResponse = () =>
  useMarriageStore(useShallow((s) => ({ connection: s.connection, setConnection: s.setConnection })));
