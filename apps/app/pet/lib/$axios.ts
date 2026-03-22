import { createAxiosClient } from '@we/utils';
import { useAuthStore } from '../data/authStore';

export const $axios = createAxiosClient(process.env.EXPO_PUBLIC_API_URL!, () => useAuthStore.getState());
