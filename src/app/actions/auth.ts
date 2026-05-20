'use server';

import { serverFetch, handleResponse } from './utils';
import { RegisterPayload, LoginCredentials } from '@/Interface/auth/AuthInterface';
import { cookies } from 'next/headers';

export async function registerUser(data: RegisterPayload) {
  const response = await serverFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function loginUser(credentials: LoginCredentials) {
  const response = await serverFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const result = await handleResponse(response);

  if (result.success && result.data.access_token) {
    const cookieStore = await cookies();
    cookieStore.set('token', result.data.access_token, {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    // We don't necessarily need to set refreshToken in cookies if we only use it client-side for now,
    // but for consistency with previous logic, let's keep it in mind.
    // The previous logic used localStorage for both.
  }

  return result;
}

export async function verifyUser(token: string) {
  const response = await serverFetch('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return handleResponse(response);
}

export async function resendVerification(email: string) {
  const response = await serverFetch('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return { success: true };
}
