import { Module } from '@nestjs/common';
import { ListController } from './list.controller';

@Module({
  controllers: [ListController],
  providers: [],
  exports: [],
})
export class ListControllerModule {}
