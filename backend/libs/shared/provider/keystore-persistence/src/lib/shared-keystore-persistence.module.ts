import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeystoreMongoDbService } from './keystore-mongodb.service';
import { Keystore, KeystoreSchema } from './schema/keystore.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Keystore.name, schema: KeystoreSchema },
    ]),
  ],
  controllers: [],
  providers: [KeystoreMongoDbService],
  exports: [KeystoreMongoDbService],
})
export class SharedKeystorePersistenceModule {}
