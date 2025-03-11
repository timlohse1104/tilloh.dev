import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentifiersService } from './identifier.service';
import { IdentifiersMongoDbService } from './identifiers-mongodb.service';
import { Identifier, IdentifierSchema } from './schema/identifiers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identifier.name, schema: IdentifierSchema },
    ]),
  ],
  controllers: [],
  providers: [IdentifiersService, IdentifiersMongoDbService],
  exports: [IdentifiersService],
})
export class SharedIdentifiersModule {}
