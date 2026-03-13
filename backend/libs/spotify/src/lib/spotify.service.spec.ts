import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { SpotifyService } from './spotify.service';

const mockItunesResponse = {
  data: {
    resultCount: 1,
    results: [
      {
        trackId: 123456789,
        trackName: 'Test Song',
        artistName: 'Artist A',
        collectionName: 'Test Album',
        artworkUrl100: 'https://example.com/100x100bb.jpg',
        previewUrl: 'https://audio-ssl.itunes.apple.com/preview/abc123.m4a',
        releaseDate: '1985-06-15T00:00:00Z',
        trackViewUrl: 'https://music.apple.com/us/album/test-song/123456789',
      },
    ],
  },
};

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a SpotifyTrackDto on getRandomTrack()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockItunesResponse as any));

    const result = await service.getRandomTrack();

    expect(result.id).toBe('123456789');
    expect(result.name).toBe('Test Song');
    expect(result.artist).toBe('Artist A');
    expect(result.album).toBe('Test Album');
    expect(result.releaseYear).toBe(1985);
    expect(result.albumCover).toBe('https://example.com/600x600bb.jpg');
    expect(result.spotifyUrl).toBe('https://music.apple.com/us/album/test-song/123456789');
    expect(result.previewUrl).toBe('https://audio-ssl.itunes.apple.com/preview/abc123.m4a');
  });

  it('should throw after 10 attempts when no results', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      of({ data: { resultCount: 0, results: [] } } as any),
    );

    await expect(service.getRandomTrack()).rejects.toThrow(
      'Could not find a random track after 10 attempts.',
    );
  });
});
