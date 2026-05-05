import axios from 'axios';
import { env } from '@/utils/environment';
import { clearSession } from '@/utils/auth';

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
