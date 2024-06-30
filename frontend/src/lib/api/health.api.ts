import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export const getMetrics = async (adminToken: string) => {
  return await fetch(`${apiURL}/metrics`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
};

export const readyz = async (adminToken: string) => {
  return await fetch(`${apiURL}/health/readyz`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
};

export const livez = async (adminToken: string) => {
  return await fetch(`${apiURL}/health/livez`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
};
