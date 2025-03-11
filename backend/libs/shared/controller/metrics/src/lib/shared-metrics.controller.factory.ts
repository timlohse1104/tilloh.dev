import { Response } from 'express';
import { Controller, Get, Res } from 'npm:@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from 'npm:@nestjs/swagger';
import { PrometheusController } from 'npm:@willsoto/nestjs-prometheus';

export function metricsControllerFactory() {
  @Controller()
  @ApiBearerAuth()
  @ApiTags('health')
  class MetricsController extends PrometheusController {
    constructor() {
      super();
    }

    @Get(`/metrics`)
    @ApiOkResponse({
      description: 'Successful response',
      type: String,
    })
    override index(@Res({ passthrough: true }) response: Response) {
      return super.index(response);
    }
  }
  return MetricsController;
}
