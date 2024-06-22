import { DynamicModule, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
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
