export const isEnter = (event) => {
  if (event['code'] === 'Enter' || event['code'] === 'Go') {
    return true;
  }
  return false;
};
