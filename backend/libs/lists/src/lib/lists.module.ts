import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListsMongoDbService } from './lists-mongodb.service';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { List, ListSchema } from './schema/lists.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: List.name, schema: ListSchema }]),
  ],
  controllers: [ListsController],
  providers: [ListsService, ListsMongoDbService],
  exports: [],
})
export class ListsModule {}
