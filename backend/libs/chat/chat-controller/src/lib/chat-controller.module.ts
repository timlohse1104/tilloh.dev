import { ChatServiceModule } from '@backend/chat/chat-provider';
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';

@Module({
  imports: [ChatServiceModule],
  controllers: [ChatController],
  providers: [],
  exports: [],
})
export class ChatControllerModule {}
