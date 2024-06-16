import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Message } from './message.entity';

export class ChatEntityDto {
  @ApiProperty({ description: 'Chat id' })
  @IsOptional()
  _id: string;

  @ApiProperty({ description: 'Chat name' })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Chat messages' })
  @IsOptional()
  messages: Message[];

  @ApiProperty({ description: 'Chat clients' })
  @IsOptional()
  clients: Record<string, string>;

  @ApiProperty({ description: 'Chat creation date' })
  @IsOptional()
  created: Date;

  @ApiProperty({ description: 'Chat update date' })
  @IsOptional()
  updated: Date;

  @ApiProperty({ description: 'Chat emoji' })
  @IsOptional()
  emoji: string;

  @ApiProperty({ description: 'Chat owner' })
  @IsOptional()
  owner: string;

  @ApiProperty({ description: 'Chat security question' })
  @IsOptional()
  securityQuestion: string;

  @ApiProperty({ description: 'Chat security answer' })
  @IsOptional()
  securityAnswer: string;
}
