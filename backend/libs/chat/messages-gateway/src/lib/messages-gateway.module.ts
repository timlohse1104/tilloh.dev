import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';

@Module({
  controllers: [],
  providers: [MessagesGateway],
  exports: [MessagesGateway],
})
export class ChatMessagesGatewayModule {}
