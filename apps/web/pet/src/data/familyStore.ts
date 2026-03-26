import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { FamilyGroupResponse, FamilyMemberInfo } from '@we/utils';

interface FamilyState {
  group: FamilyGroupResponse | null;
  setFamilyGroup: (g: FamilyGroupResponse | null) => void;
  addFamilyMember: (member: FamilyMemberInfo) => void;
  removeFamilyMember: (id: string) => void;
}

export const useFamilyStore = create<FamilyState>()((set, get) => ({
  group: null,

  setFamilyGroup: (group) => set({ group }),

  addFamilyMember: (member) => {
    const current = get().group;
    set({
      group: current
        ? { ...current, members: [...current.members, member] }
        : { id: '', name: '', members: [member] },
    });
  },

  removeFamilyMember: (id) => {
    const current = get().group;
    if (!current) return;
    const members = current.members.filter((m) => m.userId !== id);
    set({ group: members.length === 0 ? null : { ...current, members } });
  },
}));

// ── 하위호환 헬퍼 ─────────────────────────────────────────────────────────────
export const setFamilyGroup = (g: FamilyGroupResponse | null) =>
  useFamilyStore.getState().setFamilyGroup(g);
export const addFamilyMember = (m: FamilyMemberInfo) =>
  useFamilyStore.getState().addFamilyMember(m);
export const removeFamilyMember = (id: string) =>
  useFamilyStore.getState().removeFamilyMember(id);
export const useFamilyGroup = () => useFamilyStore(useShallow((s) => ({ group: s.group })));
