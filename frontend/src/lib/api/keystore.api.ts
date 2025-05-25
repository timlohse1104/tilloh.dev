import type {
  InputKeystoreDto,
  InputKeystoreUpdateDto,
  KeystoreKeyDto,
} from '$lib/types/keystore.dto';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = environment.apiBaseUrl;

export const getKeystore = async (token: string) => {
  return await fetch(`${apiURL}/keystore`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const createKey = async (createKeystoreKeyDto: KeystoreKeyDto) => {
  console.log('createKeystoreKeyDto', createKeystoreKeyDto);
  return await fetch(`${apiURL}/keystore`, {
    method: 'POST',
    headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: createKeystoreKeyDto.identifier,
      key: createKeystoreKeyDto.key,
      value: createKeystoreKeyDto.value,
    }),
  }).then((res) => res.json());
};

export const getKey = async (inputKeystoreDto: InputKeystoreDto) => {
  const { identifier, key } = inputKeystoreDto;
  const keyUrl = `${apiURL}/keystore/${identifier}/${key}`;
  return await fetch(keyUrl, {
    method: 'GET',
  }).then((res) => res.json());
};

export const updateKey = async (
  inputKeystoreUpdateDto: InputKeystoreUpdateDto,
) => {
  const { identifier, key, value } = inputKeystoreUpdateDto;
  return await fetch(`${apiURL}/keystore/${identifier}/${key}`, {
    method: 'PUT',
    headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  }).then((res) => res.json());
};

export const deleteKey = async (
  token: string,
  inputKeystoreDto: InputKeystoreDto,
) => {
  const { identifier, key } = inputKeystoreDto;
  return await fetch(`${apiURL}/keystore/${identifier}/${key}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};
