import { getKey } from '$lib/api/keystore.api';
import { TOGGLE_KEY_IDENTIFIER } from '$lib/types/keystore.dto';

export const getToggleValue = async (key: string) => {
  const toggleRes = await getKey({
    identifier: TOGGLE_KEY_IDENTIFIER,
    key,
  });
  if (toggleRes.statusCode && toggleRes.statusCode !== 200) {
    console.warn(
      `Could not retrieve toggle value for ${key}. Defaulting to true.`,
    );
    return true;
  }
  return toggleRes?.value === 'true';
};
