import { Module } from '@nestjs/common';
import { ListsMongoDbService } from './lists-mongodb.service';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  controllers: [ListsController],
  providers: [ListsService, ListsMongoDbService],
  exports: [],
})
export class ListsControllerModule {}
