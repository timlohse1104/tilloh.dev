import { Test } from '@nestjs/testing';
import { metricsControllerFactory } from './shared-metrics.controller.factory';

describe('MetricsControllerFactory', () => {
  let controller: unknown;

  beforeEach(async () => {
    const HealthCheckController = metricsControllerFactory();

    const module = await Test.createTestingModule({
      providers: [],
      controllers: [HealthCheckController],
    }).compile();
    controller = module.get(HealthCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
