import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export async function getIdentifiers(token: string) {
  return await fetch(`${apiURL}/identifiers`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
}

export async function getIdentifier(token: string, id: string) {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
}

export async function createIdentifier(token: string, name: string) {
  return await fetch(`${apiURL}/identifiers`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
}

export async function updateIdentifier(
  token: string,
  id: string,
  name: string
) {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
}

export async function deleteIdentifier(token: string, id: string) {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
}
