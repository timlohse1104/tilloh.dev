import { JokesService } from '@backend/jokes/jokes-provider';
import { JokeDto } from '@backend/shared-types';
import { Test, TestingModule } from '@nestjs/testing';
import { JokesController } from './jokes.controller';

export const mockJokeDto = (mock: Partial<JokeDto>): JokeDto => ({
  text: mock.text || 'mockText',
  language: mock.language || 'mockLanguage',
});

describe('JokesController', () => {
  let controller: JokesController;
  let jokesService: JokesService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JokesService,
          useValue: {
            getRandomJoke: jest.fn(),
            listJokes: jest.fn(),
            getJoke: jest.fn(),
            createJoke: jest.fn(),
            updateJoke: jest.fn(),
            deleteJoke: jest.fn(),
          },
        },
      ],
      controllers: [JokesController],
    }).compile();

    controller = module.get<JokesController>(JokesController);
    jokesService = module.get<JokesService>(JokesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('getRandomJoke', () => {
    it('should return a joke.', async () => {
      // arrange
      const randomJoke = mockJokeDto({});
      jest.spyOn(jokesService, 'getRandomJoke').mockResolvedValue(randomJoke);

      // act & assert
      await expect(controller.getRandomJoke()).resolves.toEqual(randomJoke);
    });
  });

  describe('listJokes', () => {
    it('should return a list of jokes.', async () => {
      // arrange
      const jokes = [mockJokeDto({}), mockJokeDto({})];
      jest.spyOn(jokesService, 'listJokes').mockResolvedValue(jokes);

      // act & assert
      await expect(controller.listJokes()).resolves.toEqual(jokes);
    });
  });

  describe('getJoke', () => {
    it('should return a joke.', async () => {
      // arrange
      const joke = mockJokeDto({});
      jest.spyOn(jokesService, 'getJoke').mockResolvedValue(joke);

      // act & assert
      await expect(controller.getJoke('mockId')).resolves.toEqual(joke);
    });
  });

  describe('createJoke', () => {
    it('should return a joke.', async () => {
      // arrange
      const joke = mockJokeDto({});
      const modifyJokeDto = { ...joke, categories: [] };
      jest.spyOn(jokesService, 'createJoke').mockResolvedValue(joke);

      // act & assert
      await expect(controller.createJoke(modifyJokeDto)).resolves.toEqual(joke);
    });
  });

  describe('updateJoke', () => {
    it('should return a joke.', async () => {
      // arrange
      const joke = mockJokeDto({});

      const modifyJokeDto = { ...joke, categories: [] };
      jest.spyOn(jokesService, 'updateJoke').mockResolvedValue(joke);

      // act & assert
      await expect(
        controller.updateJoke('mockId', modifyJokeDto),
      ).resolves.toEqual(joke);
    });
  });

  describe('deleteJoke', () => {
    it('should return a joke.', async () => {
      // arrange
      const joke = mockJokeDto({});
      jest.spyOn(jokesService, 'deleteJoke').mockResolvedValue(joke);

      // act & assert
      await expect(controller.deleteJoke('mockId')).resolves.toEqual(joke);
    });
  });
});
