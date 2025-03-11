import { HttpModule } from 'npm:@nestjs/axios';
import { Module } from 'npm:@nestjs/common';
import { ConfigModule } from 'npm:@nestjs/config';
import { SharedOcrService } from './ocr.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [],
  providers: [SharedOcrService],
  exports: [SharedOcrService],
})
export class SharedOcrModule {}
