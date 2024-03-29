import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentifiersMongoDbService } from './identifiers-mongodb.service';
import { Identifier, IdentifierSchema } from './schema/identifiers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identifier.name, schema: IdentifierSchema },
    ]),
  ],
  controllers: [],
  providers: [IdentifiersMongoDbService],
  exports: [IdentifiersMongoDbService],
})
export class MemorandumPersistenceModule {}
