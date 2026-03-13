import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

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

describe('SpotifyController', () => {
  let controller: SpotifyController;
  let service: SpotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotifyController],
      providers: [
        {
          provide: SpotifyService,
          useValue: {
            getRandomTrack: jest.fn().mockResolvedValue(mockTrack),
          },
        },
      ],
    }).compile();

    controller = module.get<SpotifyController>(SpotifyController);
    service = module.get<SpotifyService>(SpotifyService);
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
