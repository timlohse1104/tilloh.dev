export const createHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  Authorization: token ? `Bearer ${token}` : '',
});
