import { MemorandumMemorandumProviderModule } from '@backend/memorandum/memorandum-provider';
import { Module } from '@nestjs/common';
import { IdentifiersController } from './identifiers.controller';

@Module({
  imports: [MemorandumMemorandumProviderModule],
  controllers: [IdentifiersController],
  providers: [],
  exports: [],
})
export class MemorandumControllerModule {}
