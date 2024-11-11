import { OcrSpaceResponseDto } from '@backend/shared-types';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Blob, File } from 'buffer';
import { of, throwError } from 'rxjs';
import { OcrSpaceService } from './ocr.service';

describe('OcrSpaceService', () => {
  const testFileBuffer = Buffer.from('testFile');
  const testFileBlob = new Blob([testFileBuffer], {
    type: 'application/pdf',
  });
  const fileMock = new File([testFileBlob], 'file.pdf', {
    type: 'application/pdf',
  });
  let service: OcrSpaceService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcrSpaceService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'OCR_SPACE_URL':
                  return 'http://primary-url.com';
                case 'OCR_SPACE_API_KEY':
                  return 'test-api-key';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OcrSpaceService>(OcrSpaceService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log the correct debug message and make the correct HTTP request with the primary URL', async () => {
    const mockResponse: AxiosResponse<Partial<OcrSpaceResponseDto>> = {
      data: { ProcessingTimeInMilliseconds: '1000' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    jest.spyOn(httpService, 'post').mockReturnValueOnce(of(mockResponse));

    const result = await service.executeOcrProcess(fileMock);

    expect(result).toEqual(mockResponse.data);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://primary-url.com',
      expect.any(FormData),
      expect.objectContaining({
        headers: { apikey: 'test-api-key' },
      }),
    );
  });

  it('should return error if request fails', async () => {
    const errorMsgMock = 'Request failed';
    jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(throwError(() => new Error(errorMsgMock)));

    await expect(service.executeOcrProcess(fileMock)).rejects.toThrowError(
      errorMsgMock,
    );
  });
});
