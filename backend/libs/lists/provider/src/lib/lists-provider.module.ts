import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';

@Module({
  controllers: [],
  providers: [ListsService],
  exports: [ListsService],
})
export class ListsProviderModule {}
