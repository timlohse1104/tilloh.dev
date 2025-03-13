import { DynamicModule, Module } from '@nestjs/common';
import { metricsControllerFactory } from './shared-metrics.controller.factory';

@Module({})
export class SharedControllerMetricsModule {
  static registerAsync(): DynamicModule {
    return {
      imports: [],
      module: SharedControllerMetricsModule,
      controllers: [metricsControllerFactory()],
      providers: [],
      exports: [],
    };
  }
}
