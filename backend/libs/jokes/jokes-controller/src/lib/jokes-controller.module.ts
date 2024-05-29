import { JokesProviderModule } from '@backend/jokes/jokes-provider';
import { Module } from '@nestjs/common';
import { JokesController } from './jokes.controller';

@Module({
  imports: [JokesProviderModule],
  controllers: [JokesController],
  providers: [],
  exports: [],
})
export class JokesControllerModule {}
