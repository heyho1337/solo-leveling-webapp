'use server';

import { serverFetch, handleResponse } from './utils';

export async function getActiveQuests() {
  const response = await serverFetch('/users/me/quests/active');
  return handleResponse(response);
}

export async function getCompletedQuests() {
  const response = await serverFetch('/users/me/quests/completed');
  return handleResponse(response);
}

export async function getMissedQuests() {
  const response = await serverFetch('/users/me/quests/missed');
  return handleResponse(response);
}

export async function getQuests() {
  const response = await serverFetch('/users/me/quests');
  return handleResponse(response);
}

export async function getDailyQuests() {
  const response = await serverFetch('/users/me/quests/daily');
  return handleResponse(response);
}

export async function getWeeklyQuests() {
  const response = await serverFetch('/users/me/quests/weekly');
  return handleResponse(response);
}

export async function getBonusQuests() {
  const response = await serverFetch('/users/me/quests/bonus');
  return handleResponse(response);
}

export async function getHiddenQuests() {
  const response = await serverFetch('/users/me/quests/hidden');
  return handleResponse(response);
}

export async function submitQuestForm(data: any, questId?: string) {
  const url = questId ? `/users/me/quests/${questId}` : '/users/me/quests';
  const method = questId ? 'PATCH' : 'POST';
  const headers: Record<string, string> = questId ? { 'Content-Type': 'application/merge-patch+json' } : {};

  const response = await serverFetch(url, {
    method,
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function deleteQuest(questId: string) {
  const response = await serverFetch(`/users/me/quests/${questId}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}
