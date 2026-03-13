import { SpotifyTrackDto } from '@backend/shared-types';
import { Public } from '@backend/util';
import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SpotifyService } from './spotify.service';

@ApiTags('spotify')
@Controller('/spotify')
export class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  @Public()
  @ApiOkResponse({
    description: 'Random Spotify track for the Hitstar game.',
    type: SpotifyTrackDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/random-track')
  getRandomTrack() {
    return this.spotifyService.getRandomTrack();
  }
}
