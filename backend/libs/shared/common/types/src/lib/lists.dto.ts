import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ListEntryDto {
  @ApiProperty({ description: 'List entry ID', required: false })
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'List entry title', required: true })
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'List entry done status', required: true })
  @IsNotEmpty()
  done!: boolean;

  @ApiProperty({ description: 'List entry author id', required: true })
  @IsNotEmpty()
  author!: string;

  @ApiProperty({ description: 'List entry creation date', required: false })
  @IsOptional()
  created?: Date;

  @ApiProperty({ description: 'List entry update date', required: false })
  @IsOptional()
  updated?: Date;
}

export class ListDto {
  @ApiProperty({ description: 'List ID', required: false })
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'List name', required: true })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'List emoji', required: true })
  @IsNotEmpty()
  emoji!: string;

  @ApiProperty({ description: 'List owner id', required: true })
  @IsNotEmpty()
  owner!: string;

  @ApiProperty({ description: 'List owner id', required: true })
  @IsNotEmpty()
  invited!: string[];

  @ApiProperty({ description: 'List entries', required: true })
  @IsNotEmpty()
  entries!: ListEntryDto[];

  @ApiProperty({ description: 'List history', required: true })
  @IsNotEmpty()
  history!: string[];

  @ApiProperty({ description: 'List entry creation date', required: false })
  @IsOptional()
  created?: Date;

  @ApiProperty({ description: 'List entry update date', required: false })
  @IsOptional()
  updated?: Date;
}
