import { Test, TestingModule } from '@nestjs/testing';
import { HitstarController } from './hitstar.controller';
import { HitstarService } from './hitstar.service';

const mockTrack = {
  id: 'track-id-1',
  name: 'Test Song',
  artist: 'Artist A',
  album: 'Test Album',
  albumCover: 'https://example.com/cover.jpg',
  releaseYear: 1985,
  spotifyUrl: 'https://open.spotify.com/track/track-id-1',
  previewUrl: 'https://p.scdn.co/mp3-preview/abc123',
};

describe('HitstarController', () => {
  let controller: HitstarController;
  let service: HitstarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HitstarController],
      providers: [
        {
          provide: HitstarService,
          useValue: {
            getRandomTrack: jest.fn().mockResolvedValue(mockTrack),
          },
        },
      ],
    }).compile();

    controller = module.get<HitstarController>(HitstarController);
    service = module.get<HitstarService>(HitstarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getRandomTrack and return a track', async () => {
    const result = await controller.getRandomTrack();
    expect(service.getRandomTrack).toHaveBeenCalled();
    expect(result).toEqual(mockTrack);
  });
});
