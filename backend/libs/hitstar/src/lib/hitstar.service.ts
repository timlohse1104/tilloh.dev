import { SpotifyTrackDto } from '@backend/shared-types';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// Available spotify genres
// acoustic, afrobeat, alt-rock, alternative, ambient, anime, black-metal, bluegrass, blues, bossanova, brazil, breakbeat, british, cantopop, chicago-house, children, chill, classical, club, comedy, country, dance, dancehall, death-metal, deep-house, detroit-techno, disco, disney, drum-and-bass, dub, dubstep, edm, electro, electronic, emo, folk, forro, french, funk, garage, german, gospel, goth, grindcore, groove, grunge, guitar, happy, hard-rock, hardcore, hardstyle, heavy-metal, hip-hop, holidays, honky-tonk, house, idm, indian, indie, indie-pop, industrial, iranian, j-dance, j-idol, j-pop, j-rock, jazz, k-pop, kids, latin, latino, malay, mandopop, metal, metal-misc, metalcore, minimal-techno, movies, mpb, new-age, new-release, opera, pagode, party, philippines-opm, piano, pop, pop-film, post-dubstep, power-pop, progressive-house, psych-rock, punk, punk-rock, r-n-b, rainy-day, reggae, reggaeton, road-trip, rock, rock-n-roll, rockabilly, romance, sad, salsa, samba, sertanejo, show-tunes, singer-songwriter, ska, sleep, songwriter, soul, soundtracks, spanish, study, summer, swedish, synth-pop, tango, techno, trance, trip-hop, turkish, work-out, world-music

@Injectable()
export class HitstarService {
  private readonly logger = new Logger(HitstarService.name);
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
    const clientSecret = this.configService.get<string>(
      'SPOTIFY_CLIENT_SECRET',
    );
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

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
    this.tokenExpiresAt =
      Date.now() + (response.data.expires_in as number) * 1000;
    return this.accessToken;
  }

  async getRandomTrack(): Promise<SpotifyTrackDto> {
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const offset = Math.floor(Math.random() * 100);
      const token = await this.getAccessToken();

      this.logger.log(
        `Attempt ${attempt + 1}: searching Spotify (offset=${offset})`,
      );

      try {
        const year = 1955 + Math.floor(Math.random() * (2025 - 1955 + 1));
        const searchUrl = `https://api.spotify.com/v1/search?q=*+year%3A${year}+genre%3Apop&type=track&market=DE&limit=10&offset=${offset}`;
        this.logger.log(`Fetching URL: ${searchUrl}`);
        const response = await firstValueFrom(
          this.httpService.get(searchUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any[] = response.data?.tracks?.items ?? [];
        const validTracks = items.filter((t) => t.album?.release_date);

        this.logger.log(
          `Attempt ${attempt + 1}: ${items.length} tracks fetched, ${validTracks.length} usable`,
        );

        if (validTracks.length > 0) {
          const track =
            validTracks[Math.floor(Math.random() * validTracks.length)];
          const releaseYear = parseInt(
            (track.album.release_date as string).substring(0, 4),
            10,
          );
          const albumCover: string = track.album?.images?.[0]?.url ?? '';
          const artist: string = (track.artists as { name: string }[])
            .map((a) => a.name)
            .join(', ');

          this.logger.log(
            `Found: "${track.name as string}" by ${artist} (${releaseYear})`,
          );

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

        this.logger.warn(
          `Attempt ${attempt + 1}: no usable track found. HTTP ${response.status}, response: ${JSON.stringify(response.data)}`,
        );
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        const data = (err as { response?: { data?: unknown } })?.response?.data;
        this.logger.warn(
          `Attempt ${attempt + 1} failed. HTTP ${status ?? 'n/a'}, response: ${JSON.stringify(data ?? err)}`,
        );
      }
    }

    throw new Error(
      `Could not find a random track after ${maxAttempts} attempts.`,
    );
  }
}
