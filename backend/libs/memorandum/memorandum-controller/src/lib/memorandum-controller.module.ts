import { IdentifiersModule } from '@backend/shared-identifiers';
import { SharedKeystorePersistenceModule } from '@backend/shared-keystore-persistence';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentifiersController } from './identifiers.controller';
import { KeystoreController } from './keystore.controller';

@Module({
  imports: [IdentifiersModule, SharedKeystorePersistenceModule, ConfigModule],
  controllers: [IdentifiersController, KeystoreController],
  providers: [],
  exports: [],
})
export class MemorandumControllerModule {}
