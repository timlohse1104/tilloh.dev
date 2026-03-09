const emojiRegex = /\p{Extended_Pictographic}/u;

export const isEmoji = (text) => {
  return emojiRegex.test(text);
};

export const isEnter = (event) => {
  if (event['keyCode'] === 13) {
    return true;
  }
  return false;
};

export const normalizeCategory = (cat: string): string => cat.trim().toLowerCase();

export const displayCategory = (cat: string): string =>
  cat.split(' ').map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word)).join(' ');
