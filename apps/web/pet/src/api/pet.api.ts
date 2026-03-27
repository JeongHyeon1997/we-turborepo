import { $axios } from '../lib/$axios';
import type { PetInfo } from '@we/utils';

/** GET /api/pet/pets 🔒 — 내 펫 목록 */
export const getPets = () =>
  $axios.get<PetInfo[]>('/api/pet/pets');
