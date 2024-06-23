import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export async function getMetrics(adminToken: string) {
  return await fetch(`${apiURL}/metrics`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
}

export async function readyz(adminToken: string) {
  return await fetch(`${apiURL}/health/readyz`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
}

export async function livez(adminToken: string) {
  return await fetch(`${apiURL}/health/livez`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
}
