import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export async function metrics(adminToken: string, id: string) {
  return await fetch(`${apiURL}/metrics`, {
    method: 'GET',
    headers: createHeaders(adminToken),
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
}

export async function readyz(adminToken: string, id: string) {
  return await fetch(`${apiURL}/health/readyz`, {
    method: 'GET',
    headers: createHeaders(adminToken),
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
}

export async function livez(adminToken: string, id: string) {
  return await fetch(`${apiURL}/health/livez`, {
    method: 'GET',
    headers: createHeaders(adminToken),
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
}
