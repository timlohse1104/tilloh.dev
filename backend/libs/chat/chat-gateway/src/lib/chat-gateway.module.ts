import { ChatServiceModule } from '@backend/chat/chat-provider';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ChatServiceModule],
  controllers: [],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatGatewayModule {}
