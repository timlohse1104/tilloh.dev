import { dev } from '$app/environment';
import { environment } from '$lib/util/environment';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export async function verifyAdminId(id: string) {
  return await fetch(`${apiURL}/admin/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
}
