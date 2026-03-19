import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { FamilyGroup, FamilyMember } from '@we/utils';

interface FamilyState {
  group: FamilyGroup | null;
  setFamilyGroup: (g: FamilyGroup | null) => void;
  addFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;
}

export const useFamilyStore = create<FamilyState>()((set, get) => ({
  group: null,

  setFamilyGroup: (group) => set({ group }),

  addFamilyMember: (member) => {
    const today = new Date().toISOString().slice(0, 10);
    const current = get().group;
    set({
      group: current
        ? { ...current, members: [...current.members, member] }
        : { members: [member], groupStartDate: today },
    });
  },

  removeFamilyMember: (id) => {
    const current = get().group;
    if (!current) return;
    const members = current.members.filter((m) => m.id !== id);
    set({ group: members.length === 0 ? null : { ...current, members } });
  },
}));

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const setFamilyGroup = (g: FamilyGroup | null) =>
  useFamilyStore.getState().setFamilyGroup(g);
export const addFamilyMember = (m: FamilyMember) =>
  useFamilyStore.getState().addFamilyMember(m);
export const removeFamilyMember = (id: string) =>
  useFamilyStore.getState().removeFamilyMember(id);
export const useFamilyGroup = () => useFamilyStore(useShallow((s) => ({ group: s.group })));
