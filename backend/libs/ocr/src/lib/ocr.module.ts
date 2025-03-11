import { SharedOcrModule } from '@backend/shared-ocr';
import { Module } from 'npm:@nestjs/common';
import { OcrController } from './ocr.controller';

@Module({
  imports: [SharedOcrModule],
  controllers: [OcrController],
  providers: [],
  exports: [],
})
export class OcrModule {}
