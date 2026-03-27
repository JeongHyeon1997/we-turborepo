import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { PetInfo } from '@we/utils';

interface PetState {
  pets: PetInfo[];
  selectedPetId: string | null;
  setPets: (pets: PetInfo[]) => void;
  setSelectedPetId: (id: string) => void;
}

export const usePetStore = create<PetState>()((set) => ({
  pets: [],
  selectedPetId: null,
  setPets: (pets) =>
    set({ pets, selectedPetId: pets[0]?.id ?? null }),
  setSelectedPetId: (id) => set({ selectedPetId: id }),
}));

export const usePets = () =>
  usePetStore(useShallow((s) => ({ pets: s.pets, selectedPetId: s.selectedPetId })));

export const setPets = (pets: PetInfo[]) =>
  usePetStore.getState().setPets(pets);

export const setSelectedPetId = (id: string) =>
  usePetStore.getState().setSelectedPetId(id);
