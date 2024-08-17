import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';

export function healthControllerFactory() {
  @Controller('/health')
  @ApiBearerAuth()
  @ApiTags('health')
  class HealthCheckController {
    constructor(
      public healthCheckService: HealthCheckService,
      public mongooseHealthIndicator: MongooseHealthIndicator,
      public httpHealthIndicator: HttpHealthIndicator,
    ) {}

    @Get('livez')
    @ApiOkResponse({
      description: 'Successful response',
      type: String,
    })
    async metrics() {
      let healthInformation: HealthCheckResult;
      const healthCheckIndicators = [];

      healthCheckIndicators.push(
        () => this.mongooseHealthIndicator.pingCheck('mongodb'),
        () =>
          this.httpHealthIndicator.pingCheck(
            'witzapi',
            'https://witzapi.de/api/language',
          ),
      );
      try {
        healthInformation = await this.healthCheckService.check(
          healthCheckIndicators,
        );
      } catch (error: unknown) {
        healthInformation = (error as AxiosError).response;
      }

      const metrics = this.formatTerminusToString(healthInformation);
      return metrics.replace(/\n$/, '');
    }

    @Get('readyz')
    @ApiOkResponse({
      description: 'Successful response',
      type: String,
    })
    check() {
      return 'ok';
    }

    formatTerminusToString(healthInformation: HealthCheckResult): string {
      let terminusString = '';
      const { details } = healthInformation;
      Object.keys(details).forEach((key) => {
        terminusString += `${key} ${details[key].status === 'up' ? 1 : 0}\n`;
      });
      return terminusString;
    }
  }
  return HealthCheckController;
}
