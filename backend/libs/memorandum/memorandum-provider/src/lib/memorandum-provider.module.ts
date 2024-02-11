import { MemorandumPersistenceModule } from '@backend/memorandum/memorandum-persistence';
import { Module } from '@nestjs/common';
import { IdentifiersService } from './identifier.service';

@Module({
  imports: [MemorandumPersistenceModule],
  controllers: [],
  providers: [IdentifiersService],
  exports: [IdentifiersService],
})
export class MemorandumProviderModule {}
