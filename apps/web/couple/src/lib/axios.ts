import { createApi } from '@we/utils';

export const $axios = createApi(import.meta.env.VITE_API_URL);
