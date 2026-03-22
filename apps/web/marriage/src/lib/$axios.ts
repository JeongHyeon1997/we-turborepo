import { createAxiosClient } from '@we/utils';
import { useAuthStore } from '../data/authStore';

export const $axios = createAxiosClient(import.meta.env.VITE_API_URL, () => useAuthStore.getState());
