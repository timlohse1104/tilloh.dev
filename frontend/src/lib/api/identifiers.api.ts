import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export const getIdentifiers = async (token: string) => {
  return await fetch(`${apiURL}/identifiers`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const getIdentifier = async (id: string) => {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
};

export const createIdentifier = async (name: string) => {
  return await fetch(`${apiURL}/identifiers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
};

export const updateIdentifier = async (id: string, name: string) => {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
};

export const deleteIdentifier = async (token: string, id: string) => {
  return await fetch(`${apiURL}/identifiers/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
};
