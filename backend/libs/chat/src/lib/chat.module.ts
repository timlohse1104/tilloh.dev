import { Module } from 'npm:@nestjs/common';
import { MongooseModule } from 'npm:@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatMongoDbService } from './chat.mongodb.service';
import { ChatService } from './chat.service';
import { MessagesService } from './messages.service';
import { Chat, ChatSchema } from './schema/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatMongoDbService, MessagesService, ChatService],
  exports: [ChatGateway, ChatMongoDbService, MessagesService, ChatService],
})
export class ChatModule {}
