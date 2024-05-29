import { JokesMongoDbService } from '@backend/jokes/jokes-persistence';
import { JokeDto } from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JokesService {
  private readonly logger = new Logger(JokesService.name);
  constructor(private jokesMongoDbService: JokesMongoDbService) {}

  async getRandomJoke(): Promise<JokeDto> {
    this.logger.log('returned current daily joke');
    return await this.jokesMongoDbService.findRandomOne();
  }

  // TODO: cron job to get a new joke every day -> new file
  // TODO: jokes api service for connection to jokes api -> new file
  // TODO: Add jokes crud endpoints to controller
  // TODO: Add controller to main.ts
}
