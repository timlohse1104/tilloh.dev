import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedIdentifiersService } from './identifier.service';
import { IdentifiersMongoDbService } from './identifiers-mongodb.service';
import { Identifier, IdentifierSchema } from './schema/identifiers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identifier.name, schema: IdentifierSchema },
    ]),
  ],
  controllers: [],
  providers: [SharedIdentifiersService, IdentifiersMongoDbService],
  exports: [SharedIdentifiersService],
})
export class SharedIdentifiersModule {}
