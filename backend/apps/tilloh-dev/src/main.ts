import { ensureEnvValue } from '@backend/util';
import { Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './controller/controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      ensureEnvValue('MONGO_DB_URL', 'mongodb://localhost/tilloh-dev')
    ),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 61154;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
