import { Public } from '@backend/guards';
import { SharedOcrService } from '@backend/shared-ocr';
import { OcrSpaceResponseDto } from '@backend/shared-types';
import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ocr')
@Controller('/ocr')
export class OcrController {
  constructor(private sharedOcrService: SharedOcrService) {}

  @Public()
  @ApiOkResponse({
    description: 'File uploaded and processed successfully.',
    type: OcrSpaceResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('/')
  executeOcrProcess(@UploadedFile() file: File) {
    return this.sharedOcrService.executeOcrProcess(file);
  }
}
