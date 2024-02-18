import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class KeystoreDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Keystore key' })
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Keystore value' })
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Created date' })
  @IsNotEmpty()
  created: Date;

  @ApiProperty({ description: 'Updated date' })
  @IsNotEmpty()
  updated: Date;
}

export class GetKeystoreInputDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Keystore key' })
  @IsNotEmpty()
  key: string;
}
export class GetKeystoreOutputDto extends KeystoreDto {}

export class CreateKeystoreInputDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Keystore key' })
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Keystore value' })
  @IsNotEmpty()
  value: string;
}
export class CreateKeystoreOutputDto extends KeystoreDto {}

export class UpdateKeystoreInputParamDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Keystore key' })
  @IsNotEmpty()
  key: string;
}
export class UpdateKeystoreInputBodyDto {
  @ApiProperty({ description: 'Key value' })
  @IsNotEmpty()
  value: string;
}
export class UpdateKeystoreOutputDto extends KeystoreDto {}

export class RemoveKeystoreInputDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Keystore key' })
  @IsNotEmpty()
  key: string;
}
export class RemoveKeystoreOutputDto extends KeystoreDto {}
