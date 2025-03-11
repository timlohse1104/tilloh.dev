import { ApiProperty } from 'npm:@nestjs/swagger';
import { IsNotEmpty } from 'npm:class-validator';

export class KeystoreDto {
  @ApiProperty({ description: 'Identifier ID', required: false })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Keystore key', required: false })
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Keystore value', required: false })
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Created date', required: false })
  @IsNotEmpty()
  created: Date;

  @ApiProperty({ description: 'Updated date', required: false })
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
