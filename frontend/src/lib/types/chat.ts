export type Chat = {
  title: string;
  done?: boolean;
  owner?: string;
  securityQuestion?: string;
  securityAnswer?: string;
};

export type ChatList = {
  name: string;
  emoji: string;
  chats: Chat[];
  history: string[];
};
