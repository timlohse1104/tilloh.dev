import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { HitstarService } from './hitstar.service';

const mockTokenResponse = {
  data: {
    access_token: 'mock_token_123',
    expires_in: 3600,
  },
};

const mockSpotifyResponse = {
  data: {
    tracks: {
      items: [
        {
          id: 'abc123',
          name: 'Test Song',
          artists: [{ name: 'Artist A' }],
          album: {
            name: 'Test Album',
            release_date: '1985-06-15',
            images: [{ url: 'https://example.com/cover.jpg' }],
          },
          external_urls: { spotify: 'https://open.spotify.com/track/abc123' },
          preview_url: 'https://audio.spotify.com/preview/abc123.mp3',
        },
      ],
    },
  },
};

describe('HitstarService', () => {
  let service: HitstarService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HitstarService,
        {
          provide: HttpService,
          useValue: { get: jest.fn(), post: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock_value') },
        },
      ],
    }).compile();

    service = module.get<HitstarService>(HitstarService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a SpotifyTrackDto on getRandomTrack()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(httpService, 'post').mockReturnValue(of(mockTokenResponse as any));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockSpotifyResponse as any));

    const result = await service.getRandomTrack();

    expect(result.id).toBe('abc123');
    expect(result.name).toBe('Test Song');
    expect(result.artist).toBe('Artist A');
    expect(result.album).toBe('Test Album');
    expect(result.releaseYear).toBe(1985);
    expect(result.albumCover).toBe('https://example.com/cover.jpg');
    expect(result.spotifyUrl).toBe('https://open.spotify.com/track/abc123');
    expect(result.previewUrl).toBe('https://audio.spotify.com/preview/abc123.mp3');
  });

  it('should throw after 10 attempts when no results', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(httpService, 'post').mockReturnValue(of(mockTokenResponse as any));
    jest.spyOn(httpService, 'get').mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      of({ data: { tracks: { items: [] } } } as any),
    );

    await expect(service.getRandomTrack()).rejects.toThrow(
      'Could not find a random track after 10 attempts.',
    );
  });
});
