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
  @ApiProperty({ description: 'Chat ID' })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Chat name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: [MessageDto], description: 'Chat name' })
  @IsNotEmpty()
  messages: MessageDto[];

  @ApiProperty({ description: 'Chat name' })
  @IsOptional()
  created: Date;
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

export class FindAllChatsOptions {
  clientId?: string;
}
