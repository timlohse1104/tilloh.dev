import { getApiURL } from '$lib/util/environment';


export const verifyId = async (id: string, type: 'user' | 'admin') => {
  return await fetch(`${getApiURL()}/admin/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, type }),
  }).then((res) => res.json());
};
