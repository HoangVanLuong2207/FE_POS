import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  baseURLimg: import.meta.env.VITE_API_IMG_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const baseURLimg = import.meta.env.VITE_API_IMG_URL;
export { api, baseURLimg };
// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
    }
    return Promise.reject(error);
  }
);

export default api;