import { ChatMessagesServiceModule } from '@backend/chat/messages-provider';
import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [ChatMessagesServiceModule],
  controllers: [],
  providers: [MessagesGateway],
  exports: [MessagesGateway],
})
export class ChatMessagesGatewayModule {}
