import { JokesPersistenceModule } from '@backend/jokes/jokes-persistence';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JokesService } from './jokes.service';

@Module({
  imports: [HttpModule, JokesPersistenceModule],
  controllers: [],
  providers: [JokesService],
  exports: [JokesService],
})
export class JokesProviderModule {}
