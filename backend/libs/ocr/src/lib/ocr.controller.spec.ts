import { SharedOcrService } from '@backend/shared-ocr';
import { Test, TestingModule } from '@nestjs/testing';
import { OcrController } from './ocr.controller';

describe('OcrController', () => {
  let controller: OcrController;

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
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });
});
