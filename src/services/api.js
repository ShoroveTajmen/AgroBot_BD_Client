import axios from 'axios';

// In development, VITE_API_URL is empty and Vite proxies /api → localhost:5000
// In production (Vercel), VITE_API_URL is set to the Render backend URL
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({ baseURL });

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('agrobot_conversationId');
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

export default api;
