import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { healthControllerFactory } from './health.controller.factory';

describe('HealthCheckControllerFactory', () => {
  let controller: {
    metrics: () => Promise<string>;
    check: () => string;
    formatTerminusToString: (healthInformation: HealthCheckResult) => string;
  };
  let healthCheckServiceMock: HealthCheckService;
  let testService1Mock: { healthcheck: jest.Mock };
  let testService2Mock: { healthcheck: jest.Mock };
  const successResponse = { httpStatusCode: 200 };

  const mockHealthCheckResponse = (
    mock?: Partial<HealthCheckResult>,
  ): HealthCheckResult => ({
    status: mock?.status || 'ok',
    info: mock?.info || {},
    error: mock?.error || {},
    details: mock?.details || {},
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const HealthCheckController = healthControllerFactory();

    testService1Mock = { healthcheck: jest.fn() };
    testService2Mock = { healthcheck: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: { check: jest.fn() },
        },
        {
          provide: MongooseHealthIndicator,
          useValue: { pingCheck: jest.fn() },
        },
        {
          provide: HttpHealthIndicator,
          useValue: { pingCheck: jest.fn() },
        },
      ],
      controllers: [HealthCheckController],
    }).compile();

    controller = module.get(HealthCheckController);
    healthCheckServiceMock = module.get(HealthCheckService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should return healthcheck metrics string containing positive health', async () => {
    // Arrange
    const healthCheckResponseMock = mockHealthCheckResponse({
      details: {
        external_test_api_1: { status: 'up' },
        external_test_api_2: { status: 'up' },
        test_mongodb: { status: 'up' },
      },
    });
    jest
      .spyOn(healthCheckServiceMock, 'check')
      .mockResolvedValueOnce(healthCheckResponseMock);
    jest
      .spyOn(testService1Mock, 'healthcheck')
      .mockResolvedValueOnce(successResponse);
    jest
      .spyOn(testService2Mock, 'healthcheck')
      .mockResolvedValueOnce(successResponse);

    const formattedHealthCheckResponse =
      `external_test_api_1 1\n` + `external_test_api_2 1\n` + `test_mongodb 1`;

    // Act & Assert
    expect(controller.metrics()).resolves.toBe(formattedHealthCheckResponse);
  });

  it('should return healthcheck metrics string containing negative health', async () => {
    // Arrange
    const healthCheckResponseMock = mockHealthCheckResponse({
      details: {
        external_test_api_1: { status: 'down' },
        external_test_api_2: { status: 'up' },
        test_mongodb: { status: 'down' },
      },
    });
    jest
      .spyOn(healthCheckServiceMock, 'check')
      .mockResolvedValueOnce(healthCheckResponseMock);

    const formattedHealthCheckResponse =
      `external_test_api_1 0\n` + `external_test_api_2 1\n` + `test_mongodb 0`;

    // Act & Assert
    expect(controller.metrics()).resolves.toBe(formattedHealthCheckResponse);
  });
  it('should return health check string', async () => {
    // Arrange & Act & Assert
    expect(controller.check()).toBe('ok');
  });
});
