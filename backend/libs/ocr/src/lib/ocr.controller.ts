import { SharedOcrService } from '@backend/shared-ocr';
import { OcrSpaceResponseDto } from '@backend/shared-types';
import { Public } from '@backend/util';
import FastifyMulter from 'npm:@nest-lab/fastify-multer';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from 'npm:@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from 'npm:@nestjs/swagger';
const { File, FileInterceptor } = FastifyMulter;

@ApiTags('ocr')
@Controller('/ocr')
export class OcrController {
  constructor(private sharedOcrService: SharedOcrService) {}

  @Public()
  @ApiBearerAuth()
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
