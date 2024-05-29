import { JokesMongoDbService } from '@backend/jokes/jokes-persistence';
import { JokeDto, ModifyJokeDto } from '@backend/shared/types';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JokesService {
  private readonly logger = new Logger(JokesService.name);
  constructor(
    private jokesMongoDbService: JokesMongoDbService,
    private httpService: HttpService
  ) {}

  @Cron('30 0 * * *', { timeZone: 'Europe/Berlin' })
  async persistDailyJoke() {
    this.logger.log('Getting new joke of the day from jokes-api.');
    const jokeUrl = 'https://witzapi.de/api/joke/?limit=1&language=de';

    let joke: JokeDto;
    try {
      const jokeResponse = await firstValueFrom(this.httpService.get(jokeUrl));
      joke = jokeResponse.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error('Failed to fetch data: ' + error?.message);
    }

    this.logger.log('Persisting the joke of the day.');
    await this.jokesMongoDbService.create(joke);
  }

  async getRandomJoke(): Promise<JokeDto> {
    this.logger.log('Getting the random joke of the day.');
    return await this.jokesMongoDbService.findRandomOne();
  }

  async getJokeById(id: string): Promise<JokeDto> {
    this.logger.log('Getting a joke by id.');
    return await this.jokesMongoDbService.findOne(id);
  }

  async createJoke(createJokeDto: ModifyJokeDto): Promise<JokeDto> {
    this.logger.log('Creating a joke.');
    return await this.jokesMongoDbService.create(createJokeDto);
  }

  async updateJoke(
    id: string,
    modifyJokeDto: Partial<ModifyJokeDto>
  ): Promise<JokeDto> {
    this.logger.log('Updating a joke.');
    return await this.jokesMongoDbService.update(id, modifyJokeDto);
  }

  async deleteJoke(id: string): Promise<JokeDto> {
    this.logger.log('Deleting a joke.');
    return await this.jokesMongoDbService.remove(id);
  }
}
