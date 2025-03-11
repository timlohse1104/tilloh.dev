import { SharedIdentifiersModule } from '@backend/shared-identifiers';
import { SharedKeystorePersistenceModule } from '@backend/shared-keystore-persistence';
import { Module } from 'npm:@nestjs/common';
import { ConfigModule } from 'npm:@nestjs/config';
import { IdentifiersController } from './identifiers.controller';
import { KeystoreController } from './keystore.controller';

@Module({
  imports: [
    ConfigModule,
    SharedIdentifiersModule,
    SharedKeystorePersistenceModule,
  ],
  controllers: [IdentifiersController, KeystoreController],
  providers: [],
  exports: [],
})
export class MemorandumModule {}
