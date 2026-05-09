import api from './api';

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

type LoginCredentials = {
  usernameOrEmail: string;
  password: string;
};

export const authService = {
  async register(data: RegisterPayload) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async verify(token: string) {
    const response = await api.post('/auth/verify', { token });
    return response.data;
  },

  async resendVerification(email: string) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      document.cookie = `token=${response.data.access_token}; path=/; max-age=86400; samesite=lax`;
    }
    return response.data;
  }
};
