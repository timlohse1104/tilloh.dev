import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentifiersController } from './identifiers.controller';
import { KeystoreController } from './keystore.controller';

@Module({
  imports: [ConfigModule],
  controllers: [IdentifiersController, KeystoreController],
  providers: [],
  exports: [],
})
export class MemorandumModule {}
