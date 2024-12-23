import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedOcrService } from './ocr.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [],
  providers: [SharedOcrService],
  exports: [SharedOcrService],
})
export class SharedOcrModule {}
