export class KeystoreKeyDto {
  identifier: string;
  key: string;
  value: string;
  updated?: string;
  created?: string;
  _id?: string;
}

export class InputKeystoreDto {
  identifier: string;
  key: string;
}

export class InputKeystoreUpdateDto extends InputKeystoreDto {
  value: string;
}
