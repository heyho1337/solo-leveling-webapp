'use server';

import { serverFetch, handleResponse } from './utils';

export async function getInventory() {
  const response = await serverFetch('/user_inventories');
  return handleResponse(response);
}

export async function getEquipment() {
  const response = await serverFetch('/user_equipment');
  return handleResponse(response);
}
