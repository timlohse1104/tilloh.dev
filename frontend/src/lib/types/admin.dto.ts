export class ReturnVerifyAdminDto {
  isAdmin!: boolean;
}

export enum ActivityTypeDto {
  IDENTIFIER = 'identifier',
  PRESET = 'link-preset',
  JOKE = 'joke',
  CHAT = 'chat',
}

export class ActivityDto {
  id: string;
  type: ActivityTypeDto;
  description: string;
  created: string;
  updated: string;
}

export class AdminDashboardPropsDto {
  identifierAmount: number;
  presetAmounts: number;
  presetFolderAmount: number;
  presetLinksAmount: number;
  jokesAmount: number;
  chatsAmount: number;
  apiIsHealthy: boolean;
  jokesIsHealthy: boolean;
  mongoIsHealthy: boolean;
}
