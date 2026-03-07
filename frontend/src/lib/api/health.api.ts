import { getApiURL } from '$lib/util/environment';
import { createHeaders } from './helper';


export const getMetrics = async (adminToken: string) => {
  return await fetch(`${getApiURL()}/metrics`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
};

export const readyz = async (adminToken: string) => {
  return await fetch(`${getApiURL()}/health/readyz`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
};

export const livez = async (adminToken: string) => {
  return await fetch(`${getApiURL()}/health/livez`, {
    method: 'GET',
    headers: createHeaders(adminToken),
  }).then((res) => res.text());
};
