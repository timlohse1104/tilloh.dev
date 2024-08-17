import { JokesMongoDbService } from '@backend/jokes/jokes-persistence';
import { mockHttpResponse, mockJokeDto } from '@backend/util';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';
import { JokesService } from './jokes.service';

describe('JokesService', () => {
  let service: JokesService;
  let jokesMongoDbServiceMock: JokesMongoDbService;
  let httpService: HttpService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JokesMongoDbService,
          useValue: {
            findRandomOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        JokesService,
      ],
    }).compile();

    service = module.get<JokesService>(JokesService);
    jokesMongoDbServiceMock =
      module.get<JokesMongoDbService>(JokesMongoDbService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('persistDailyJoke', () => {
    it('should persist a daily joke', async () => {
      // arrange
      const joke = mockJokeDto({ text: 'joke1' });
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(mockHttpResponse({ data: joke }));
      const createSpy = jest.spyOn(jokesMongoDbServiceMock, 'create');

      // act
      await service.persistDailyJoke();

      // assert
      expect(createSpy).toHaveBeenCalledWith(joke);
    });
    it('should throw an error when httpService.get fails', async () => {
      const errorMessage = 'Network Error';

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error(errorMessage)));

      await expect(service.persistDailyJoke()).rejects.toThrow(
        'Failed to fetch data: ' + errorMessage,
      );
    });
  });

  describe('getRandomJoke', () => {
    it('should get a random joke', async () => {
      // arrange
      const joke = mockJokeDto({ text: 'joke1' });
      jest
        .spyOn(jokesMongoDbServiceMock, 'findRandomOne')
        .mockResolvedValue(joke);

      // act
      const result = await service.getRandomJoke();

      // assert
      expect(result).toEqual(joke);
    });
  });

  describe('listJokes', () => {
    it('should list all jokes', async () => {
      // arrange
      const jokes = [
        mockJokeDto({ text: 'joke1' }),
        mockJokeDto({ text: 'joke2' }),
      ];
      jest.spyOn(jokesMongoDbServiceMock, 'findAll').mockResolvedValue(jokes);

      // act
      const result = await service.listJokes();

      // assert
      expect(result).toEqual(jokes);
    });
  });

  describe('getJoke', () => {
    it('should get a joke by id', async () => {
      // arrange
      const joke = mockJokeDto({ text: 'joke1' });
      jest.spyOn(jokesMongoDbServiceMock, 'findOne').mockResolvedValue(joke);

      // act
      const result = await service.getJoke('id');

      // assert
      expect(result).toEqual(joke);
    });
  });

  describe('createJoke', () => {
    it('should create a joke', async () => {
      // arrange
      const joke = mockJokeDto({ text: 'joke1' });
      jest.spyOn(jokesMongoDbServiceMock, 'create').mockResolvedValue(joke);

      // act
      const result = await service.createJoke({ ...joke, categories: [] });

      // assert
      expect(result).toEqual(joke);
    });
  });

  describe('updateJoke', () => {
    it('should update a joke', async () => {
      // arrange
      const joke = mockJokeDto({ text: 'joke1' });
      jest.spyOn(jokesMongoDbServiceMock, 'update').mockResolvedValue(joke);

      // act
      const result = await service.updateJoke('id', joke);

      // assert
      expect(result).toEqual(joke);
    });
  });

  describe('removeJoke', () => {
    it('should remove a joke', async () => {
      // arrange

      // act
      await service.deleteJoke('id');

      // assert
      expect(jokesMongoDbServiceMock.remove).toHaveBeenCalledWith('id');
    });
  });
});
