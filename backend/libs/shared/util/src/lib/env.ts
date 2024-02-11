import { isString } from 'class-validator';

export function ensureEnvValue(env: string, fallback: string): string {
  const value = process.env[env];
  if (isString(value)) {
    return value;
  }

  return fallback;
}
