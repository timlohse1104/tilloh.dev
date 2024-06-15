export class CreateKeystoreKeyDto {
  identifier: string;
  key: string;
  value: string;
}

export class InputKeystoreDto {
  identifier: string;
  key: string;
}

export class InputKeystoreUpdateDto extends InputKeystoreDto {
  value: string;
}
