import { dev } from '$app/environment';
import type { SharedTodoListResponse } from '$lib/types/todo';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export const getSharedTodoList = async (
  sharedId: string,
): Promise<{ status: number; data: SharedTodoListResponse | null }> => {
  const response = await fetch(`${apiURL}/shared-todo-lists/${sharedId}`);

  const responseData = response.ok ? await response.json() : null;

  return {
    status: response.status,
    data: responseData,
  };
};

export const createSharedTodoList = async (
  name: string,
  emoji: string,
): Promise<SharedTodoListResponse> => {
  return await fetch(`${apiURL}/shared-todo-lists`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify({ name, emoji }),
  }).then((res) => res.json());
};

export const updateSharedTodoList = async (
  sharedId: string,
  data: {
    name: string;
    emoji: string;
    todos: any[];
    history: string[];
    version: number;
  },
): Promise<{ status: number; data: SharedTodoListResponse | null }> => {
  const response = await fetch(`${apiURL}/shared-todo-lists/${sharedId}`, {
    method: 'PUT',
    headers: createHeaders(),
    body: JSON.stringify({ ...data, id: sharedId }),
  });

  const responseData = response.ok ? await response.json() : null;

  return {
    status: response.status,
    data: responseData,
  };
};

export const deleteSharedTodoList = async (
  sharedId: string,
): Promise<SharedTodoListResponse> => {
  return await fetch(`${apiURL}/shared-todo-lists/${sharedId}`, {
    method: 'DELETE',
  }).then((res) => res.json());
};
