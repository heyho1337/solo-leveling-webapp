'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.API_INTERNAL_URL || 'http://app:8000/api/v1';

export async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const headers = await getAuthHeader();
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (headers.Authorization) {
    fetchHeaders.Authorization = headers.Authorization;
  }

  if (options.headers) {
    Object.assign(fetchHeaders, options.headers);
  }

  const response = await fetch(url, {
    ...options,
    headers: fetchHeaders,
  });

  return response;
}

export async function handleResponse(response: Response) {
  if (response.status === 204) {
    return { success: true };
  }

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data.detail || data.message || data['hydra:description'] || 'An error occurred',
      status: response.status,
    };
  }

  return { success: true, data };
}

export async function getCurrentUser() {
  const response = await serverFetch('/users/me');
  return handleResponse(response);
}
