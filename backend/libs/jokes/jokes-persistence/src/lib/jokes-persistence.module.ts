import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JokesMongoDbService } from './jokes-mongodb.service';
import { Joke, JokeSchema } from './schema/jokes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Joke.name, schema: JokeSchema }]),
  ],
  controllers: [],
  providers: [JokesMongoDbService],
  exports: [JokesMongoDbService],
})
export class JokesPersistenceModule {}
