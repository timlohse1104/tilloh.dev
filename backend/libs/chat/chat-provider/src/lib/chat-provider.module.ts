import { ChatPersistenceModule } from '@backend/chat/chat-persistence';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessagesService } from './messages.service';

@Module({
  imports: [ChatPersistenceModule],
  controllers: [],
  providers: [MessagesService, ChatService],
  exports: [MessagesService, ChatService],
})
export class ChatServiceModule {}
