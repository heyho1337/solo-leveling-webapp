'use server';

import { serverFetch, handleResponse } from './utils';

export async function getExercises() {
  const response = await serverFetch('/users/me/exercises');
  return handleResponse(response);
}

export async function submitExerciseForm(data: any, exerciseId?: string) {
  const url = exerciseId ? `/users/me/exercises/${exerciseId}` : '/users/me/exercises';
  const method = exerciseId ? 'PATCH' : 'POST';
  const headers: Record<string, string> = exerciseId ? { 'Content-Type': 'application/merge-patch+json' } : {};

  const response = await serverFetch(url, {
    method,
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function deleteExercise(exerciseId: string) {
  const response = await serverFetch(`/users/me/exercises/${exerciseId}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}
