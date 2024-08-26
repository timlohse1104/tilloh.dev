import { IsNotEmpty } from 'class-validator';
import { Message } from './message.entity';

export class CreateMessageDto extends Message {
  @IsNotEmpty()
  chatId: string;
}
