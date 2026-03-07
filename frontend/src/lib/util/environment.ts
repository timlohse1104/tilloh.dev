import { dev } from '$app/environment';

// Default URLs — overridden by /config/config.json if present at runtime.
// No top-level await is used here to ensure Safari 14 compatibility
// (WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=242740)
export const environment = {
  localApiBaseUrl: 'http://localhost:61154/v1',
  productionApiBaseUrl: 'https://api.tilloh.dev/v1',
};

export const getApiURL = () =>
  dev ? environment.localApiBaseUrl : environment.productionApiBaseUrl;

// Eagerly start the config fetch; update environment once resolved.
// By the time the user triggers any API call, this will have settled.
fetchBackendUrl().then((url) => {
  if (url) {
    environment.localApiBaseUrl = url;
    environment.productionApiBaseUrl = url;
  }
});

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
