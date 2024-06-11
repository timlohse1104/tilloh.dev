import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export async function getIdentifiers(token: string) {
  return await fetch(`${apiURL}/identifiers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export async function getIdentifier(token: string, id: string) {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export async function createIdentifier(token: string, name: string) {
  return await fetch(`${apiURL}/identifiers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
}

export async function deleteIdentifier(token: string, id: string) {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}
