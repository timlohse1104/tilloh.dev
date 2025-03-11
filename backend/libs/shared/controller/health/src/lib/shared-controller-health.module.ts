import { DynamicModule, Module } from 'npm:@nestjs/common';
import { TerminusModule } from 'npm:@nestjs/terminus';
import { healthControllerFactory } from './health.controller.factory';

@Module({})
export class SharedControllerHealthModule {
  static registerAsync(): DynamicModule {
    return {
      module: SharedControllerHealthModule,
      controllers: [healthControllerFactory()],
      imports: [TerminusModule],
      providers: [],
      exports: [],
    };
  }
}
