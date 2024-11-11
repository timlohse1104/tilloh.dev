import { Module } from '@nestjs/common';
import { SharedOcrService } from './ocr.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SharedOcrService],
  exports: [SharedOcrService],
})
export class SharedKeystorePersistenceModule {}
