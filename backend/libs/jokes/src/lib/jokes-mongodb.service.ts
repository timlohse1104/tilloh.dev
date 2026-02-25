import { JokeTexts } from '@backend/shared-texts';
import { JokeDto, ModifyJokeDto } from '@backend/shared-types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Filter } from 'mongodb';
import { Model } from 'mongoose';
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

    const jokeCount = await this.jokeModel
      .countDocuments({
        $or: [{ verified: true }, { verified: { $exists: false } }],
      })
      .exec();
    const random = Math.floor(Math.random() * jokeCount);
    const randomJoke = await this.jokeModel
      .findOne({ $or: [{ verified: true }, { verified: { $exists: false } }] })
      .skip(random)
      .exec();

    if (!randomJoke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }

    this.logger.debug({ output: randomJoke }, JokeTexts.FOUND_ONE);
    return randomJoke.toObject();
  }

  /**
   * Fetches a the joke of the day from mongodb collection 'jokes'.
   *
   * @returns A single joke object.
   */
  async findJokeOfTheDay(): Promise<JokeDto> {
    this.logger.debug(JokeTexts.ATTEMPT_FIND_DAILY_ONE);
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setUTCDate(startOfToday.getUTCDate() + 1);

    const jokeFromYesterday = await this.jokeModel
      .findOne({
        $and: [
          { $or: [{ verified: true }, { verified: { $exists: false } }] },
          {
            created: {
              $gte: startOfToday,
              $lt: startOfTomorrow,
            },
          },
        ],
      })
      .exec();

    if (!jokeFromYesterday) {
      this.logger.warn(JokeTexts.FROM_YESTERDAY_NOT_FOUND);
      const randomJoke = await this.findRandomOne();

      if (!randomJoke) {
        throw new NotFoundException(JokeTexts.NOT_FOUND);
      }

      return randomJoke;
    }

    this.logger.debug({ output: jokeFromYesterday }, JokeTexts.FOUND_ONE);
    return jokeFromYesterday.toObject();
  }

  /**
   * Fetches all jokes from the mongodb collection 'jokes'.
   *
   * @param filter Optional param to filter for specific joke results.
   * @returns An array of joke objects.
   */
  async findAll(filter: Filter<JokeDocument> = {}): Promise<JokeDto[]> {
    this.logger.debug({ input: { filter } }, JokeTexts.ATTEMPT_FIND_ALL);
    const jokes = await this.jokeModel.find(filter as any).exec();
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

  /**
   * Deletes all duplicate jokes from the mongodb collection 'jokes' and only keep the latest.
   */
  async removeDuplicates(): Promise<void> {
    try {
      this.logger.debug('Retrieving duplicate jokes.');
      const duplicates = await this.jokeModel.aggregate([
        {
          $group: {
            _id: '$text',
            uniqueIds: { $addToSet: '$_id' },
            latest: { $max: '$created' },
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: '$uniqueIds' }, 1] },
          },
        },
      ]);
      this.logger.debug(`Found ${duplicates.length} duplicate jokes.`);
      if (duplicates.length === 0) {
        this.logger.warn(JokeTexts.NO_DUPLICATES);
        return;
      }
      for (const group of duplicates) {
        const latestJoke = await this.jokeModel
          .findOne({ text: group?._id, created: group?.latest })
          .exec();

        const deleteResult = await this.jokeModel
          .deleteMany({ text: group?._id, _id: { $ne: latestJoke?._id } })
          .exec();

        this.logger.debug(
          `Removed ${deleteResult?.deletedCount} duplicates for joke '${group?._id}'.`,
        );
      }
    } catch (error) {
      this.logger.error(JokeTexts.ERROR_REMOVING_DUPLICATE, error);
    }
  }
}
