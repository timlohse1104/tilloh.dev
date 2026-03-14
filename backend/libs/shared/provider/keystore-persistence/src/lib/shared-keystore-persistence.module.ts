import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeystoreMongoDbService } from './keystore-mongodb.service';
import { Keystore, KeystoreSchema } from './schema/keystore.schema';
import { ToggleSeedService } from './toggle-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Keystore.name, schema: KeystoreSchema },
    ]),
  ],
  controllers: [],
  providers: [KeystoreMongoDbService, ToggleSeedService],
  exports: [KeystoreMongoDbService],
})
export class SharedKeystorePersistenceModule {}
