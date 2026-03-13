import { createApi } from '@we/utils';

const BASE_URL = __DEV__
  ? 'http://localhost:3001'
  : 'https://api.pet.example.com';

export const api = createApi(BASE_URL);
