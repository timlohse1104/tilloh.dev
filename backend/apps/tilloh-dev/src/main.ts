import { ensureEnvValue } from '@backend/util';
import { Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppController } from './controller/identifier-controller';

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
