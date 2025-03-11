import { JokeDto, ModifyJokeDto } from '@backend/shared-types';
import { HttpService } from 'npm:@nestjs/axios';
import { Injectable, Logger } from 'npm:@nestjs/common';
import { Cron } from 'npm:@nestjs/schedule';
import { FilterQuery } from 'npm:mongoose';
import { firstValueFrom } from 'npm:rxjs';
import { JokesMongoDbService } from './jokes-mongodb.service';
import { JokeDocument } from './schema/jokes.schema';

@Injectable()
export class JokesService {
  private readonly logger = new Logger(JokesService.name);
  constructor(
    private jokesMongoDbService: JokesMongoDbService,
    private httpService: HttpService,
  ) {}

  /**
   * Fetches a joke from the jokes-api and persists it in the database.
   * This method is scheduled to run every day at 3:00 AM.
   */
  @Cron('0 3 * * *', { timeZone: 'Europe/Berlin' })
  async persistDailyJoke() {
    this.logger.log('Getting new joke of the day from jokes-api.');
    const jokeUrl = 'https://witzapi.de/api/joke/?limit=1&language=de';

    let joke: JokeDto;
    try {
      const jokeResponse = await firstValueFrom(this.httpService.get(jokeUrl));
      joke = jokeResponse.data;
      joke.verified = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error('Failed to fetch data: ' + error?.message);
    }

    this.logger.log('Persisting the joke of the day.');
    await this.jokesMongoDbService.create(joke);
  }

  /**
   * Duplicate joke cleanup task.
   * This method is scheduled to run every day at 3:30 AM.
   */
  @Cron('30 3 * * *', { timeZone: 'Europe/Berlin' })
  async cleanupDuplicateJokes() {
    this.logger.log('Cleaning up duplicate jokes.');
    await this.jokesMongoDbService.removeDuplicates();
  }

  /**
   * Fetches the joke of the day.
   *
   * @returns A single joke.
   */
  async getJokeOfTheDay(): Promise<JokeDto> {
    this.logger.log('Getting the joke of the day.');
    return await this.jokesMongoDbService.findJokeOfTheDay();
  }

  /**
   * Fetches a random joke.
   *
   * @returns A single joke.
   */
  async getRandomJoke(): Promise<JokeDto> {
    this.logger.log('Getting the random joke of the day.');
    return await this.jokesMongoDbService.findRandomOne();
  }

  /**
   * Fetches all jokes.
   *
   * @param filter Optional param to filter for specific joke results.
   * @returns An array of jokes.
   */
  async listJokes(filter: FilterQuery<JokeDocument> = {}): Promise<JokeDto[]> {
    this.logger.log('Getting all jokes.');
    return await this.jokesMongoDbService.findAll(filter);
  }

  /**
   * Fetches a joke by its id.
   *
   * @param id The id of the joke.
   * @returns A single joke.
   */
  async getJoke(id: string): Promise<JokeDto> {
    this.logger.log('Getting a joke by id.');
    return await this.jokesMongoDbService.findOne(id);
  }

  /**
   * Creates a new joke.
   *
   * @param createJokeDto The joke to create.
   * @returns The created joke.
   */
  async createJoke(createJokeDto: ModifyJokeDto): Promise<JokeDto> {
    this.logger.log('Creating a joke.');
    return await this.jokesMongoDbService.create(createJokeDto);
  }

  /**
   * Updates a joke by its id.
   *
   * @param id The id of the joke.
   * @param modifyJokeDto The joke to update.
   * @returns The updated joke.
   */
  async updateJoke(
    id: string,
    modifyJokeDto: Partial<ModifyJokeDto>,
  ): Promise<JokeDto> {
    this.logger.log('Updating a joke.');
    return await this.jokesMongoDbService.update(id, modifyJokeDto);
  }

  /**
   * Deletes a joke by its id.
   *
   * @param id The id of the joke.
   * @returns The deleted joke.
   */
  async deleteJoke(id: string): Promise<JokeDto> {
    this.logger.log('Deleting a joke.');
    return await this.jokesMongoDbService.remove(id);
  }
}
