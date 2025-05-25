import { environment } from '$lib/util/environment';

const apiURL = environment.apiBaseUrl;

export const verifyId = async (id: string, type: 'user' | 'admin') => {
  return await fetch(`${apiURL}/admin/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, type }),
  }).then((res) => res.json());
};
