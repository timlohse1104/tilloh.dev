import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Module({
  controllers: [],
  providers: [MessagesGateway, MessagesService],
  exports: [],
})
export class ChatModule {}
