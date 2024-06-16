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
