import { Module } from '@nestjs/common';
import { KeystoreMongoDbService } from './ocr.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KeystoreMongoDbService],
  exports: [KeystoreMongoDbService],
})
export class SharedKeystorePersistenceModule {}
