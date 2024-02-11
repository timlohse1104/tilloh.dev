import { Module } from '@nestjs/common';
import { IdentifiersService } from './identifier.service';

@Module({
  controllers: [],
  providers: [IdentifiersService],
  exports: [IdentifiersService],
})
export class MemorandumMemorandumProviderModule {}
