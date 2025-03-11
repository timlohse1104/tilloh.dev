import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'npm:class-validator';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  id: number;

  @IsNotEmpty()
  override chatId: string;
}
