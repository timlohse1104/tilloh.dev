import { Test } from 'npm:@nestjs/testing';
import { metricsControllerFactory } from './shared-metrics.controller.factory';

describe('MetricsControllerFactory', () => {
  let controller: unknown;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const HealthCheckController = metricsControllerFactory();

    const module = await Test.createTestingModule({
      providers: [],
      controllers: [HealthCheckController],
    }).compile();
    controller = module.get(HealthCheckController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
