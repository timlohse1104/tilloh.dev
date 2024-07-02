import { Module } from '@nestjs/common';
import { ListsMongoDBService } from './lists-mongodb.service';

@Module({
  controllers: [],
  providers: [ListsMongoDBService],
  exports: [],
})
export class ListsPersistenceModule {}
