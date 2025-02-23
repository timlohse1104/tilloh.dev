import { JokesService } from '@backend/jokes/jokes-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { JokesController } from './jokes.controller';

describe('JokesController', () => {
  let controller: JokesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JokesService,
          useValue: {
            getRandomJoke: jest.fn(),
            getJokeOfTheDay: jest.fn(),
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
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });
});
