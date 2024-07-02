import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';

@Module({
  controllers: [ListsController],
  providers: [],
  exports: [],
})
export class ListsControllerModule {}
