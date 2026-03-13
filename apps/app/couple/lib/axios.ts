import { createApi } from '@we/utils';

const BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://api.couple.example.com';

export const api = createApi(BASE_URL);
