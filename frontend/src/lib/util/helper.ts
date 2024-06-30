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
