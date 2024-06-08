import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class IdentifierDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Identifier name' })
  @IsNotEmpty()
  name: string;
}

export class GetIdentifiersOutputDto extends IdentifierDto {}

export class GetIdentifierInputDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  id: string;
}
export class GetIdentifierOutputDto extends IdentifierDto {}

export class CreateIdentifierInputDto {
  @ApiProperty({ description: 'Identifier name' })
  @IsNotEmpty()
  name: string;
}
export class CreateIdentifierOutputDto extends IdentifierDto {}

export class UpdateIdentifierInputDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  id: string;
}
export class UpdateIdentifierOutputDto extends IdentifierDto {}

export class RemoveIdentifierInputDto {
  @ApiProperty({ description: 'Identifier ID' })
  @IsNotEmpty()
  id: string;
}
export class RemoveIdentifierOutputDto extends IdentifierDto {}
