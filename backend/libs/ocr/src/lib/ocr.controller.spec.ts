import { SharedOcrService } from '@backend/shared-ocr';
import { OcrSpaceResponseDto } from '@backend/shared-types';
import { File } from 'npm:@nest-lab/fastify-multer';
import { Test, TestingModule } from 'npm:@nestjs/testing';
import { OcrController } from './ocr.controller';

describe('OcrController', () => {
  let controller: OcrController;
  let sharedOcrService: SharedOcrService;

  const testFileBuffer = Buffer.from('testFile');
  const mockFilename = 'test.pdf';
  const fileMock: File = {
    buffer: testFileBuffer,
    mimetype: 'application/pdf',
    fieldname: '',
    originalname: mockFilename,
    encoding: 'binary',
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SharedOcrService,
          useValue: {
            executeOcrProcess: jest.fn(),
          },
        },
      ],
      controllers: [OcrController],
    }).compile();

    controller = module.get<OcrController>(OcrController);
    sharedOcrService = module.get<SharedOcrService>(SharedOcrService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('executeOcrProcess', () => {
    it('should return ocr data.', async () => {
      // arrange
      const ocrResponseMock: OcrSpaceResponseDto = {
        ParsedResults: [
          {
            TextOverlay: {
              HasOverlay: false,
              Lines: [],
            },
            TextOrientation: '0',
            FileParseExitCode: 1,
            ParsedText: 'test line',
            ErrorMessage: '',
            ErrorDetails: '',
          },
        ],
        OCRExitCode: 1,
        IsErroredOnProcessing: false,
        ErrorMessage: '',
        ErrorDetails: '',
        ProcessingTimeInMilliseconds: '5000',
      };
      jest
        .spyOn(sharedOcrService, 'executeOcrProcess')
        .mockResolvedValue(ocrResponseMock);

      // act & assert
      await expect(controller.executeOcrProcess(fileMock)).resolves.toEqual(
        ocrResponseMock,
      );
    });
  });
});
