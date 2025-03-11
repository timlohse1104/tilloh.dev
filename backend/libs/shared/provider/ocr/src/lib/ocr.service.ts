import { OcrSpaceResponseDto } from '@backend/shared-types';
import { File } from 'npm:@nest-lab/fastify-multer';
import { HttpService } from 'npm:@nestjs/axios';
import { Injectable, Logger } from 'npm:@nestjs/common';
import { ConfigService } from 'npm:@nestjs/config';
import { AxiosResponse } from 'npm:axios';
import { firstValueFrom } from 'npm:rxjs';

@Injectable()
export class SharedOcrService {
  private readonly logger = new Logger(SharedOcrService.name);

  constructor(
    private config: ConfigService,
    private httpService: HttpService,
  ) {}

  /**
   * Execute OCR process on OCR.space API
   *
   * @param file The object data to be processed
   * @returns The OCR.space response
   */
  async executeOcrProcess(file: File): Promise<OcrSpaceResponseDto> {
    this.logger.debug(
      {
        input: {
          objectData: `${file.size} bytes`,
        },
      },
      'Executing OCRSpace process.',
    );
    const ocrSpaceUrlDefault = this.config.get('OCR_SPACE_URL');
    const ocrSpaceApiKey = this.config.get('OCR_SPACE_API_KEY');
    const fileName = file.originalname;

    if (!file.buffer) throw new Error('File is empty.');

    const body = new FormData();
    body.set('scale', 'true');
    // body.set('isTable', 'true'); // TODO: Enable table extraction
    body.set('OCREngine', '2');
    body.set('filetype', file.mimetype);
    body.set(
      'file',
      new Blob([file.buffer], { type: file.mimetype }),
      fileName,
    );

    const ocrResponse = await this.requestOcrSpaceApi(
      ocrSpaceUrlDefault,
      body,
      ocrSpaceApiKey,
    );

    const processingTime: number = parseFloat(
      ocrResponse?.data?.ProcessingTimeInMilliseconds,
    );
    this.logger.log(
      { output: ocrResponse.statusText },
      `(OCR.space API response within ${processingTime / 1000} seconds.`,
    );

    const ocrResponseData = ocrResponse.data;
    this.logger.debug(
      { output: { ocrResponse: ocrResponseData } },
      'OCRSpace response.',
    );
    return ocrResponseData;
  }

  /**
   * Request OCR.space API
   *
   * @param url The OCR.space API URL
   * @param body The body form data to send
   * @param apiKey The API key to authenticate
   * @returns The OCR.space API response
   */
  private async requestOcrSpaceApi(
    url: string,
    body: FormData,
    apiKey: string,
  ): Promise<AxiosResponse<OcrSpaceResponseDto>> {
    return firstValueFrom(
      this.httpService.post(url, body, {
        method: 'POST',
        headers: {
          apikey: apiKey,
        },
      }),
    );
  }
}
