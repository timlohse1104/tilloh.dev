import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class MessageDto {
  @ApiProperty({ description: 'Message author name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Message text' })
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Message timestamp' })
  @IsNotEmpty()
  timestamp: Date;
}

export class ChatDto {
  @ApiProperty({ description: 'Chat ID', required: false })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Chat name', required: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [MessageDto],
    description: 'Chat name',
    required: false,
  })
  @IsNotEmpty()
  messages: MessageDto[];

  @ApiProperty({ description: 'Chat creation date', required: false })
  @IsOptional()
  created: Date;

  @ApiProperty({ description: 'Chat update date', required: false })
  @IsOptional()
  updated: Date;

  @ApiProperty({ description: 'Chat emoji', required: false })
  @IsOptional()
  emoji: string;

  @ApiProperty({ description: 'Chat owner id', required: false })
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'Chat security question', required: false })
  @IsNotEmpty()
  securityQuestion: string;

  @ApiProperty({ description: 'Chat security answer', required: false })
  @IsNotEmpty()
  securityAnswer: string;
}

export class GetChatsOutputDto extends ChatDto {}

export class GetChatInputDto {
  @ApiProperty({ description: 'Chat ID' })
  @IsNotEmpty()
  id: string;
}
export class GetChatOutputDto extends ChatDto {}

export class CreateChatInputDto {
  @ApiProperty({ description: 'Chat name' })
  @IsNotEmpty()
  name: string;
}
export class CreateChatOutputDto extends ChatDto {}

export class UpdateChatInputDto {
  @ApiProperty({ description: 'Chat ID' })
  @IsNotEmpty()
  id: string;
}
export class UpdateChatOutputDto extends ChatDto {}

export class RemoveChatInputDto {
  @ApiProperty({ description: 'Chat ID' })
  @IsNotEmpty()
  id: string;
}
export class RemoveChatOutputDto extends ChatDto {}
