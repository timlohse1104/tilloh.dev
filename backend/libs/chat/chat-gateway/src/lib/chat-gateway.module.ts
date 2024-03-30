import { Module } from '@nestjs/common';
import { ChatServiceModule } from 'libs/chat/chat-provider/src';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ChatServiceModule],
  controllers: [],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatGatewayModule {}
