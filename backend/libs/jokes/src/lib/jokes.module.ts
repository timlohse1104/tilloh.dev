import { HttpModule } from '@nestjs/axios';
import { Module } from 'npm:@nestjs/common';
import { MongooseModule } from 'npm:@nestjs/mongoose';
import { JokesMongoDbService } from './jokes-mongodb.service';
import { JokesController } from './jokes.controller';
import { JokesService } from './jokes.service';
import { Joke, JokeSchema } from './schema/jokes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Joke.name, schema: JokeSchema }]),
    HttpModule,
  ],
  controllers: [JokesController],
  providers: [JokesService, JokesMongoDbService],
  exports: [],
})
export class JokesModule {}
