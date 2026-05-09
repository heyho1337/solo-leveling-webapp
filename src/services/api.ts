import axios from 'axios';

const isServer = typeof window === 'undefined';
const baseURL = isServer 
  ? (process.env.API_INTERNAL_URL || 'http://app:8000/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for attaching JWT
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Call your refresh endpoint here
        // const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh`, { refresh_token: refreshToken });
        // localStorage.setItem('token', data.token);
        
        // return api(originalRequest);
      } catch {
        // Redirect to login or clear state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
