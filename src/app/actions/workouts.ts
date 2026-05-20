'use server';

import { serverFetch, handleResponse } from './utils';

export async function getWorkouts() {
  const response = await serverFetch('/users/me/workout');
  return handleResponse(response);
}

export async function submitWorkoutForm(data: any, workoutId?: string) {
  const url = workoutId ? `/users/me/workout/${workoutId}` : '/users/me/workout';
  const method = workoutId ? 'PATCH' : 'POST';
  const headers: Record<string, string> = workoutId ? { 'Content-Type': 'application/merge-patch+json' } : {};

  const response = await serverFetch(url, {
    method,
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function deleteWorkout(workoutId: string) {
  const response = await serverFetch(`/users/me/workout/${workoutId}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}
