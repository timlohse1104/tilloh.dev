export const environment = {
  localApiBaseUrl: (await fetchBackendUrl()) || 'http://localhost:61154/v1',
  productionApiBaseUrl:
    (await fetchBackendUrl()) || 'https://api.tilloh.dev/v1',
};

async function fetchBackendUrl(): Promise<string> {
  let configResponse;
  try {
    configResponse = await fetch('/config.json');
    if (!configResponse.ok) {
      console.warn(
        `Failed to fetch backend URL from config.json. This is no issue at all. The application will use the default URL instead.`,
      );
      return undefined;
    }
  } catch (error) {
    console.warn('Network error: Failed to fetch backend URL from config.');
    return undefined;
  }
  const config = await configResponse?.json();
  return config?.backendUrl;
}
