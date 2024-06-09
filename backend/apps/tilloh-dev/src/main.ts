import { ChatControllerModule } from '@backend/chat/chat-controller';
import { ChatGatewayModule } from '@backend/chat/chat-gateway';
import { JokesControllerModule } from '@backend/jokes/jokes-controller';
import { MemorandumControllerModule } from '@backend/memorandum/memorandum-controller';
import {
  AuthGuard,
  GlobalExceptionFilter,
  LoggerMiddleware,
} from '@backend/util';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, HttpAdapterHost, NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ScheduleModule } from '@nestjs/schedule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule, Logger as PinoLogger } from 'nestjs-pino';
import { EnvironmentVariables, validate } from './env.validation';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 300000,
        limit: 50,
      },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validate(config) {
        return validate(EnvironmentVariables, config);
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: () =>
          `,"time":"${new Date(Date.now()).toLocaleString('de-DE', {
            timeZone: 'Europe/Berlin',
          })}"`,
        level: 'trace',
        formatters: {
          level(label) {
            return { level: label.toUpperCase() };
          },
        },
        customSuccessMessage: function (req, res) {
          if (res.statusCode >= 200 && res.statusCode <= 400) {
            return `⬆️  ${req.method} Request completed`;
          }
          return `❌ ${req.method} Request errored`;
        },
      },
    }),
    ChatGatewayModule,
    ChatControllerModule,
    MemorandumControllerModule,
    JokesControllerModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  /**
   * Bind middleware to the application.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const globalPrefix = process.env.GLOBAL_PREFIX;
  const port = process.env.PORT;
  const address = process.env.SERVER_ADDRESS;

  app.setGlobalPrefix(globalPrefix);
  app.useLogger(app.get(PinoLogger));
  app.enableCors();
  app.useGlobalFilters(
    new GlobalExceptionFilter(app.get(HttpAdapterHost), app.get(PinoLogger))
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('tilloh.dev')
    .setDescription('The official tilloh.dev API documentation 📖')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  await app.listen(port, address, () => {
    Logger.log(
      `🚀 Application is running on: http://${address}:${port}/${globalPrefix}`
    );
  });
}

bootstrap();
