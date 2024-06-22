import { Controller, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Response } from 'express';

export function metricsControllerFactory() {
  @ApiBearerAuth()
  @Controller()
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
    async index(@Res({ passthrough: true }) response: Response) {
      return super.index(response);
    }
  }
  return MetricsController;
}
