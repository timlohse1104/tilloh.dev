import { SpotifyTrackDto } from '@backend/shared-types';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);

  constructor(private httpService: HttpService) {}

  async getRandomTrack(): Promise<SpotifyTrackDto> {
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const char = String.fromCharCode(97 + Math.floor(Math.random() * 26));

      this.logger.log(`Attempt ${attempt + 1}: searching iTunes for char="${char}"`);

      try {
        const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(char)}&entity=song&limit=20`;
        const response = await firstValueFrom(this.httpService.get(searchUrl));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results: any[] = response.data?.results ?? [];

        const validTracks = results.filter((track) => {
          if (!track.previewUrl) return false;
          if (!track.releaseDate) return false;
          const year = parseInt((track.releaseDate as string).substring(0, 4), 10);
          return !isNaN(year) && year >= 1950 && year <= 2026;
        });

        if (validTracks.length > 0) {
          const track = validTracks[Math.floor(Math.random() * validTracks.length)];
          const releaseYear = parseInt((track.releaseDate as string).substring(0, 4), 10);
          const albumCover = track.artworkUrl100
            ? (track.artworkUrl100 as string).replace('100x100bb', '600x600bb')
            : '';

          this.logger.log(`Found: "${track.trackName}" by ${track.artistName} (${releaseYear})`);

          return {
            id: String(track.trackId),
            name: track.trackName as string,
            artist: track.artistName as string,
            album: track.collectionName as string,
            albumCover,
            releaseYear,
            spotifyUrl: track.trackViewUrl as string,
            previewUrl: track.previewUrl as string,
          };
        }

        this.logger.warn(`Attempt ${attempt + 1}: no usable track found, retrying.`);
      } catch (err) {
        this.logger.warn(`Attempt ${attempt + 1} failed: ${err}`);
      }
    }

    throw new Error(`Could not find a random track after ${maxAttempts} attempts.`);
  }
}
