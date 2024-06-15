import { dev } from '$app/environment';
import type {
  InputKeystoreDto,
  InputKeystoreUpdateDto,
  KeystoreKeyDto,
} from '$lib/types/keystore.dto';
import { environment } from '$lib/util/environment';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

const createHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export async function getKeystore(token: string) {
  return await fetch(`${apiURL}/keystore`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
}

export async function createKey(createKeystoreKeyDto: KeystoreKeyDto) {
  return await fetch(`${apiURL}/keystore`, {
    method: 'POST',
    body: JSON.stringify(createKeystoreKeyDto),
  }).then((res) => res.json());
}

export async function getKey(inputKeystoreDto: InputKeystoreDto) {
  const { identifier, key } = inputKeystoreDto;
  return await fetch(`${apiURL}/keystore/${identifier}/${key}`, {
    method: 'GET',
  }).then((res) => res.json());
}

export async function updateKey(
  inputKeystoreUpdateDto: InputKeystoreUpdateDto
) {
  const { identifier, key, value } = inputKeystoreUpdateDto;
  return await fetch(`${apiURL}/keystore/${identifier}/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  }).then((res) => res.json());
}

export async function deleteKey(
  token: string,
  inputKeystoreDto: InputKeystoreDto
) {
  const { identifier, key } = inputKeystoreDto;
  return await fetch(`${apiURL}/keystore/${identifier}/${key}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
}
