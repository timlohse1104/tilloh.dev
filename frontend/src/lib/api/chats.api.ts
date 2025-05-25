import type { ChatDto } from '$lib/types/chats.dto';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = environment.apiBaseUrl;

export const getChats = async (token: string): Promise<ChatDto[]> => {
  return await fetch(`${apiURL}/chats`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const createChat = async (
  token: string,
  name: string,
): Promise<ChatDto> => {
  return await fetch(`${apiURL}/chats`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
};

export const getChat = async (token: string, id: string): Promise<ChatDto> => {
  return await fetch(`${apiURL}/chats/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const updateChat = async (
  token: string,
  id: string,
  name: string,
): Promise<ChatDto> => {
  return await fetch(`${apiURL}/chats/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
};

export const deleteChat = async (
  token: string,
  id: string,
): Promise<ChatDto> => {
  return await fetch(`${apiURL}/chats/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
};
