import { DynamicModule, Module } from 'npm:@nestjs/common';
import { metricsControllerFactory } from './shared-metrics.controller.factory';

@Module({})
export class SharedControllerMetricsModule {
  static registerAsync(): DynamicModule {
    return {
      module: SharedControllerMetricsModule,
      controllers: [metricsControllerFactory()],
      imports: [],
      providers: [],
      exports: [],
    };
  }
}
