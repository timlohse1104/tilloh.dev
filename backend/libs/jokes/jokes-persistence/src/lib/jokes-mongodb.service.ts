import { JokeTexts } from '@backend/shared-texts';
import { JokeDto, ModifyJokeDto } from '@backend/shared-types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Joke, JokeDocument } from './schema/jokes.schema';

@Injectable()
export class JokesMongoDbService {
  private readonly logger = new Logger(JokesMongoDbService.name);

  constructor(
    @InjectModel(Joke.name)
    private jokeModel: Model<JokeDocument>,
  ) {}

  /**
   * Fetches a random joke from the mongodb collection 'jokes'.
   *
   * @returns A single joke object.
   */
  async findRandomOne(): Promise<JokeDto> {
    this.logger.debug(JokeTexts.ATTEMPT_FIND_RANDOM_ONE);
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setUTCDate(startOfToday.getUTCDate() + 1);

    const joke = await this.jokeModel
      .findOne({
        created: {
          $gte: startOfToday,
          $lt: startOfTomorrow,
        },
      })
      .exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.FOUND_ONE);
    return joke.toObject();
  }

  /**
   * Fetches all jokes from the mongodb collection 'jokes'.
   *
   * @returns An array of joke objects.
   */
  async findAll(filter: FilterQuery<JokeDocument> = {}): Promise<JokeDto[]> {
    this.logger.debug({ input: { filter } }, JokeTexts.ATTEMPT_FIND_ALL);
    const jokes = await this.jokeModel.find(filter).exec();
    this.logger.debug({ output: jokes }, JokeTexts.FOUND_ALL);
    return jokes.map((joke) => joke.toObject());
  }

  /**
   * Fetches a joke by its id from the mongodb collection 'jokes'.
   *
   * @param id The id of the joke.
   * @returns A single joke object.
   */
  async findOne(id: string): Promise<JokeDto> {
    this.logger.debug({ input: { id } }, JokeTexts.ATTEMPT_FIND_ONE);
    const joke = await this.jokeModel.findOne({ _id: id }).exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.FOUND_ONE);
    return joke.toObject();
  }

  /**
   * Creates a new joke in the mongodb collection 'jokes'.
   *
   * @param createJokeDto The joke to create.
   * @returns The created joke object.
   */
  async create(createJokeDto: Partial<ModifyJokeDto>): Promise<JokeDto> {
    this.logger.debug({ input: { createJokeDto } }, JokeTexts.ATTEMPT_CREATE);
    const jokeEntry = (await this.jokeModel.create(createJokeDto)).save();
    const jokeEntity = (await jokeEntry).toObject();
    this.logger.debug({ output: jokeEntity }, JokeTexts.CREATED_ONE);
    return jokeEntity;
  }

  /**
   * Updates a joke by its id in the mongodb collection 'jokes'.
   *
   * @param id The id of the joke.
   * @param modifyJokeDto The joke information to be updated.
   * @returns The updated joke object.
   */
  async update(
    id: string,
    modifyJokeDto: Partial<ModifyJokeDto>,
  ): Promise<JokeDto> {
    this.logger.debug({ input: { modifyJokeDto } }, JokeTexts.ATTEMPT_UPDATE);
    const joke = await this.jokeModel
      .findOneAndUpdate(
        { _id: id },
        { ...modifyJokeDto, updated: new Date() },
        { new: true },
      )
      .exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.UPDATED_ONE);
    return joke.toObject();
  }

  /**
   * Deletes a joke by its id from the mongodb collection 'jokes'.
   *
   * @param id The id of the joke.
   * @returns The deleted joke object.
   */
  async remove(id: string): Promise<JokeDto> {
    this.logger.debug({ input: { id } }, JokeTexts.ATTEMPT_DELETE);
    const joke = await this.jokeModel.findOneAndDelete({ _id: id }).exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.DELETE_ONE);
    return joke.toObject();
  }
}
