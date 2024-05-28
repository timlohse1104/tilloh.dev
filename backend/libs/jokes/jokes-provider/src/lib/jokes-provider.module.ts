import { JokesPersistenceModule } from '@backend/jokes/jokes-persistence';
import { Module } from '@nestjs/common';
import { JokesService } from './jokes.service';

@Module({
  imports: [JokesPersistenceModule],
  controllers: [],
  providers: [JokesService],
  exports: [JokesService],
})
export class JokesProviderModule {}
