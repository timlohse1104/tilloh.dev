const emojiRegex = /\p{Extended_Pictographic}/u;

export const isEmoji = (text) => {
  return emojiRegex.test(text);
};

export const isEnter = (event) => {
  if (
    event['code'] === 'Enter' ||
    event['code'] === 'Go' ||
    event['code'] === 'Send' ||
    event['code'] === 'Search'
  ) {
    return true;
  }
  return false;
};
