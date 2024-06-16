import { dev } from '$app/environment';
import type { ChatDto } from '$lib/types/chats.dto';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export async function getChats(token: string): Promise<ChatDto[]> {
  return await fetch(`${apiURL}/chats`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
}

export async function createChat(
  token: string,
  name: string
): Promise<ChatDto> {
  return await fetch(`${apiURL}/chats`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
}

export async function getChat(token: string, id: string): Promise<ChatDto> {
  return await fetch(`${apiURL}/chats/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
}

export async function updateChat(
  token: string,
  id: string,
  name: string
): Promise<ChatDto> {
  return await fetch(`${apiURL}/chats/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
}

export async function deleteChat(token: string, id: string): Promise<ChatDto> {
  return await fetch(`${apiURL}/chats/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
}
