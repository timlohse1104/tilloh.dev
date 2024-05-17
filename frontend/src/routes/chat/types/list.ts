import type { Chat } from './chat';

export type ChatList = {
  name: string;
  emoji: string;
  chats: Chat[];
  history: string[];
};
