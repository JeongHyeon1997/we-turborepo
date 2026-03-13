import axios from 'axios';
import type { AxiosInstance } from 'axios';

export function createApi(baseURL: string): AxiosInstance {
  const api = axios.create({
    baseURL,
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use((config) => {
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // if (error.response?.status === 401) { /* 로그아웃 처리 */ }
      return Promise.reject(error);
    },
  );

  return api;
}
