const emojiRegex = /\p{Extended_Pictographic}/u;

export function isEmoji(text) {
  return emojiRegex.test(text);
}

export const isEnter = (event) => {
  if (event['code'] === 'Enter' || event['code'] === 'Go') {
    return true;
  }
  return false;
};
