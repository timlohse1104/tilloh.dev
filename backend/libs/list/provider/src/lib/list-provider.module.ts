import { Module } from '@nestjs/common';
import { ListService } from './list.service';

@Module({
  controllers: [],
  providers: [ListService],
  exports: [ListService],
})
export class ListProviderModule {}
