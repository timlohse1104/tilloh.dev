import { MemorandumControllerModule } from '@backend/memorandum/memorandum-controller';
import { ensureEnvValue } from '@backend/util';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Joi from 'joi';
import { LoggerModule, Logger as PinoLogger } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        GLOBAL_PREFIX: Joi.string().required(),
        PORT: Joi.number().required(),
        MONGO_DB_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(
      ensureEnvValue('MONGO_DB_URL', 'mongodb://localhost/tilloh-dev')
    ),
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
      },
    }),
    MemorandumControllerModule,
  ],
  providers: [Logger],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const globalPrefix = ensureEnvValue('GLOBAL_PREFIX', 'api');
  app.setGlobalPrefix(globalPrefix);
  app.useLogger(app.get(PinoLogger));
  const port = ensureEnvValue('PORT', '61154');

  const config = new DocumentBuilder()
    .setTitle('tilloh.dev')
    .setDescription('The official tilloh.dev API documentation 📖')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
