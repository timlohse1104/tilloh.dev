import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export const verifyAdminId = async (id: string) => {
  return await fetch(`${apiURL}/admin/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
};

export const verifyUserId = async (id: string) => {
  return await fetch(`${apiURL}/user/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
};
