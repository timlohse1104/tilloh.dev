export const environment = {
  localApiBaseUrl: (await fetchBackendUrl()) || 'http://localhost:61154/v1',
  productionApiBaseUrl:
    (await fetchBackendUrl()) || 'https://api.tilloh.dev/v1',
};

async function fetchBackendUrl(): Promise<string> {
  const response = await fetch('/config.json');
  const config = await response?.json();
  return config?.backendUrl;
}
