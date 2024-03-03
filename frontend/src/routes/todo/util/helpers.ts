const emojiRegex = /\p{Extended_Pictographic}/u;

export function isEmoji(text) {
  return emojiRegex.test(text);
}
