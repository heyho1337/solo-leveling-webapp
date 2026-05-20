export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}
