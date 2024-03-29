import { ChatPersistenceModule } from '@backend/chat/chat-persistence';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Module({
  imports: [ChatPersistenceModule],
  controllers: [],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class ChatMessagesServiceModule {}
