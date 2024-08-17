import { JokeDto } from '@backend/shared-types';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, Model } from 'mongoose';
import { JokesMongoDbService } from './jokes-mongodb.service';
import { Joke, JokeDocument } from './schema/jokes.schema';

const mockJokeDto = (mock: Partial<JokeDto>): JokeDto => ({
  text: mock.text || 'mockText',
  language: mock.language || 'mockLanguage',
});

const mockJokeDocument = (
  mock: Partial<JokeDto>,
): Partial<Document<JokeDto>> => ({
  toObject: jest.fn().mockReturnValue(mockJokeDto(mock)),
});

describe('JokesMongoDbService', () => {
  let service: JokesMongoDbService;
  let jokeModel: Model<JokeDocument>;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Joke.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        JokesMongoDbService,
      ],
    }).compile();

    service = module.get<JokesMongoDbService>(JokesMongoDbService);
    jokeModel = module.get<Model<JokeDocument>>(getModelToken(Joke.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('findRandomOne', () => {
    it('should find a random joke', async () => {
      // arrange
      const expectedJoke = mockJokeDto({ text: 'joke1' });
      jest.spyOn(jokeModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockJokeDocument(expectedJoke)),
      } as never);

      // act & assert
      await expect(service.findRandomOne()).resolves.toEqual(expectedJoke);
    });
    it('should throw a not found exception when joke is not found', async () => {
      // arrange
      jest.spyOn(jokeModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.findRandomOne()).rejects.toThrow('Joke not found');
    });
    it('should throw a not found exception when joke is not found', async () => {
      // arrange
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error());

      // act & assert
      await expect(service.findRandomOne()).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should find all jokes', async () => {
      // arrange
      const expectedJokes = [mockJokeDto({ text: 'joke1' })];
      jest.spyOn(jokeModel, 'find').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValueOnce([mockJokeDocument(expectedJokes[0])]),
      } as never);

      // act & assert
      await expect(service.findAll()).resolves.toEqual(expectedJokes);
    });
    it('should throw an error when jokes find fails', async () => {
      // arrange
      jest.spyOn(jokeModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should find a joke by id', async () => {
      // arrange
      const expectedJoke = mockJokeDto({ text: 'joke1' });
      jest.spyOn(jokeModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockJokeDocument(expectedJoke)),
      } as never);

      // act & assert
      await expect(service.findOne('id')).resolves.toEqual(expectedJoke);
    });
    it('should throw a not found exception when joke is not found', async () => {
      // arrange
      jest.spyOn(jokeModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.findOne('id')).rejects.toThrow('Joke not found');
    });
    it('should throw an error when joke find fails', async () => {
      // arrange
      jest.spyOn(jokeModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.findOne('id')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a joke', async () => {
      // arrange
      const expectedJoke = mockJokeDto({ text: 'joke1' });
      jest
        .spyOn(jokeModel, 'create')
        .mockResolvedValueOnce(expectedJoke as never);

      // act & assert
      await expect(service.create(expectedJoke)).resolves.toEqual(expectedJoke);
    });
    it('should throw an error when joke create fails', async () => {
      // arrange
      jest.spyOn(jokeModel, 'create').mockRejectedValueOnce(new Error());

      // act & assert
      await expect(service.create(mockJokeDto({}))).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a joke', async () => {
      // arrange
      const expectedJoke = mockJokeDto({ text: 'joke1' });
      jest.spyOn(jokeModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockJokeDocument(expectedJoke)),
      } as never);

      // act & assert
      await expect(service.update('id', expectedJoke)).resolves.toEqual(
        expectedJoke,
      );
    });
    it('should throw a not found exception when joke is not found', async () => {
      // arrange
      jest.spyOn(jokeModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.update('id', mockJokeDto({}))).rejects.toThrow(
        'Joke not found',
      );
    });
    it('should throw an error when joke update fails', async () => {
      // arrange
      jest.spyOn(jokeModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.update('id', mockJokeDto({}))).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a joke', async () => {
      // arrange
      const expectedJoke = mockJokeDto({ text: 'joke1' });
      jest.spyOn(jokeModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockJokeDocument(expectedJoke)),
      } as never);

      // act & assert
      await expect(service.remove('id')).resolves.toEqual(expectedJoke);
    });
    it('should throw a not found exception when joke is not found', async () => {
      // arrange
      jest.spyOn(jokeModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.remove('id')).rejects.toThrow('Joke not found');
    });
    it('should throw an error when joke remove fails', async () => {
      // arrange
      jest.spyOn(jokeModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.remove('id')).rejects.toThrow();
    });
  });
});