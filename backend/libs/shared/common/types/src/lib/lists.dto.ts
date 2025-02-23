import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ListEntryDto {
  @ApiProperty({ description: 'List entry ID', required: false })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'List entry title', required: false })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'List entry done status', required: false })
  @IsOptional()
  done: boolean;

  @ApiProperty({ description: 'List entry creation date', required: false })
  @IsOptional()
  created: Date;

  @ApiProperty({ description: 'List entry update date', required: false })
  @IsOptional()
  updated: Date;
}

export class ListDto {
  @ApiProperty({ description: 'List ID', required: false })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'List name', required: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'List emoji', required: false })
  @IsNotEmpty()
  emoji: string;

  @ApiProperty({ description: 'List entries' })
  entries: ListEntryDto[];

  @ApiProperty({ description: 'List history' })
  history: string[];

  @ApiProperty({ description: 'List entry creation date', required: false })
  @IsOptional()
  created: Date;

  @ApiProperty({ description: 'List entry update date', required: false })
  @IsOptional()
  updated: Date;
}
