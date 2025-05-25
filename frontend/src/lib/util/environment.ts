import { dev } from '$app/environment';

export const environment = {
  apiBaseUrl: dev
    ? 'http://localhost:61154/v1'
    : (await fetchBackendUrl()) || 'https://api.tilloh.dev/v1',
};

async function fetchBackendUrl(): Promise<string> {
  let configResponse;
  try {
    configResponse = await fetch('/config/config.json');
    if (!configResponse.ok) {
      console.warn(
        `Failed to fetch backend URL from config.json. This is no issue at all. The application will use the default URL instead.`,
      );
      return undefined;
    }
  } catch (error) {
    console.warn(
      'Network error: Failed to fetch backend URL from config.',
      error,
    );
    return undefined;
  }

  let jsonConfig;
  try {
    jsonConfig = await configResponse?.json();
  } catch (error) {
    console.warn(
      'Could not parse config as JSON. Using default URL instead.',
      error,
    );
    return undefined;
  }
  return jsonConfig?.backendUrl;
}
