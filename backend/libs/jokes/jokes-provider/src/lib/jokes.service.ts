import { JokesMongoDbService } from '@backend/jokes/jokes-persistence';
import { JokeDto, ModifyJokeDto } from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JokesService {
  private readonly logger = new Logger(JokesService.name);
  constructor(private jokesMongoDbService: JokesMongoDbService) {}

  async getRandomJoke(): Promise<JokeDto> {
    this.logger.log('returns current daily joke');
    return await this.jokesMongoDbService.findRandomOne();
  }

  async getJokeById(id: string): Promise<JokeDto> {
    this.logger.log('returns a joke by id');
    return await this.jokesMongoDbService.findOne(id);
  }

  async createJoke(createJokeDto: ModifyJokeDto): Promise<JokeDto> {
    this.logger.log('creates a joke');
    return await this.jokesMongoDbService.create(createJokeDto);
  }

  async updateJoke(
    id: string,
    modifyJokeDto: Partial<ModifyJokeDto>
  ): Promise<JokeDto> {
    this.logger.log('updates a joke');
    return await this.jokesMongoDbService.update(id, modifyJokeDto);
  }

  async deleteJoke(id: string): Promise<JokeDto> {
    this.logger.log('deletes a joke');
    return await this.jokesMongoDbService.remove(id);
  }

  // TODO: cron job to get a new joke every day -> new file
  // TODO: jokes api service for connection to jokes api -> new file
  // TODO: Add jokes crud endpoints to controller
  // TODO: Add controller to main.ts
}
