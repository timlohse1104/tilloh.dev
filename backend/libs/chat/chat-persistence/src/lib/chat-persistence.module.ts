import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMongoDbService } from './chat.mongodb.service';
import { Chat, ChatSchema } from './schema/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [],
  providers: [ChatMongoDbService],
  exports: [ChatMongoDbService],
})
export class ChatPersistenceModule {}
