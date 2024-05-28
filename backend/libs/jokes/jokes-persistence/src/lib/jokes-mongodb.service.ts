import { JokeTexts } from '@backend/shared/texts';
import { JokeDto } from '@backend/shared/types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Joke, JokeDocument } from './schema/jokes.schema';

@Injectable()
export class JokesMongoDbService {
  private readonly logger = new Logger(JokesMongoDbService.name);

  constructor(
    @InjectModel(Joke.name)
    private jokeModel: Model<JokeDocument>
  ) {}

  async findRandomOne(): Promise<JokeDto> {
    this.logger.debug(JokeTexts.ATTEMPT_FIND_RANDOM_ONE);
    const today = new Date().setHours(0, 0, 0, 0);
    const joke = await this.jokeModel
      .findOne({
        createdAt: {
          $gte: today,
        },
      })
      .exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.FOUND_ONE);
    return joke.toObject();
  }

  async findOne(id: string): Promise<JokeDto> {
    this.logger.debug({ input: { id } }, JokeTexts.ATTEMPT_FIND_ONE);
    const joke = await this.jokeModel.findOne({ _id: id }).exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.FOUND_ONE);
    return joke.toObject();
  }

  async create(name: string): Promise<JokeDto> {
    this.logger.debug({ input: {} }, JokeTexts.ATTEMPT_CREATE);
    const joke = await this.jokeModel.create({
      _id: randomUUID(),
      name,
    });
    this.logger.debug({ output: joke?.toObject() }, JokeTexts.CREATED_ONE);
    return joke.toObject();
  }

  async update(id: string, jokeDto: Partial<JokeDto>): Promise<JokeDto> {
    this.logger.debug(
      { input: { id, jokeDto: jokeDto } },
      JokeTexts.ATTEMPT_UPDATE
    );
    const joke = await this.jokeModel
      .findOneAndUpdate(
        { _id: id },
        { ...jokeDto, updated: new Date() },
        { new: true }
      )
      .exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.UPDATED_ONE);
    return joke.toObject();
  }

  async remove(id: string) {
    this.logger.debug({ input: { id } }, JokeTexts.ATTEMPT_DELETE);
    const joke = await this.jokeModel.findOneAndDelete({ _id: id }).exec();

    if (!joke) {
      throw new NotFoundException(JokeTexts.NOT_FOUND);
    }
    this.logger.debug({ output: joke }, JokeTexts.DELETE_ONE);
    return joke.toObject();
  }
}
