import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChatDto {
  @ApiProperty({ description: 'Chat ID' })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Chat name' })
  @IsNotEmpty()
  name: string;
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
