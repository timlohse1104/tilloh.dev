import type { ChatDto } from '$lib/types/chats.dto';
import { getApiURL } from '$lib/util/environment';
import { createHeaders } from './helper';


export const getChats = async (token: string): Promise<ChatDto[]> => {
  return await fetch(`${getApiURL()}/chats`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const createChat = async (
  token: string,
  name: string,
): Promise<ChatDto> => {
  return await fetch(`${getApiURL()}/chats`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
};

export const getChat = async (token: string, id: string): Promise<ChatDto> => {
  return await fetch(`${getApiURL()}/chats/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const updateChat = async (
  token: string,
  id: string,
  name: string,
): Promise<ChatDto> => {
  return await fetch(`${getApiURL()}/chats/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
};

export const deleteChat = async (
  token: string,
  id: string,
): Promise<ChatDto> => {
  return await fetch(`${getApiURL()}/chats/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
};
