import { Module } from '@nestjs/common';
import { ChatMongoDbService } from './chat.mongodb.service';

@Module({
  controllers: [],
  providers: [ChatMongoDbService],
  exports: [ChatMongoDbService],
})
export class ChatChatPersistenceModule {}
