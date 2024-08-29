import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class IdentifierDto {
  @ApiProperty({ description: 'Identifier ID', required: false })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Identifier name', required: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Chat creation date', required: false })
  @IsOptional()
  created: Date;

  @ApiProperty({ description: 'Chat update date', required: false })
  @IsOptional()
  updated: Date;
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
