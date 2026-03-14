import { SpotifyTrackDto } from '@backend/shared-types';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60_000) {
      return this.accessToken;
    }

    const clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await firstValueFrom(
      this.httpService.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    this.accessToken = response.data.access_token as string;
    this.tokenExpiresAt = Date.now() + (response.data.expires_in as number) * 1000;
    return this.accessToken;
  }

  async getRandomTrack(): Promise<SpotifyTrackDto> {
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const offset = Math.floor(Math.random() * 50);
      const token = await this.getAccessToken();

      this.logger.log(`Attempt ${attempt + 1}: searching Spotify (offset=${offset})`);

      try {
        const searchUrl = `https://api.spotify.com/v1/search?q=*+year%3A1950-2025&type=track&market=DE&limit=1&offset=${offset}`;
        const response = await firstValueFrom(
          this.httpService.get(searchUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any[] = response.data?.tracks?.items ?? [];
        const validTracks = items.filter((t) => t.preview_url && t.album?.release_date);

        if (validTracks.length > 0) {
          const track = validTracks[0];
          const releaseYear = parseInt(
            (track.album.release_date as string).substring(0, 4),
            10,
          );
          const albumCover: string = track.album?.images?.[0]?.url ?? '';
          const artist: string = (track.artists as { name: string }[])
            .map((a) => a.name)
            .join(', ');

          this.logger.log(`Found: "${track.name as string}" by ${artist} (${releaseYear})`);

          return {
            id: track.id as string,
            name: track.name as string,
            artist,
            album: track.album.name as string,
            albumCover,
            releaseYear,
            spotifyUrl: (track.external_urls?.spotify as string) ?? '',
            previewUrl: track.preview_url as string,
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
