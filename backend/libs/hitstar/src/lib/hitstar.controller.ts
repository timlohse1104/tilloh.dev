import { SpotifyTrackDto } from '@backend/shared-types';
import { Public } from '@backend/util';
import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HitstarService } from './hitstar.service';

@ApiTags('hitstar')
@Controller('/hitstar')
export class HitstarController {
  constructor(private hitstarService: HitstarService) {}

  @Public()
  @ApiOkResponse({
    description: 'Random Spotify track for the Hitstar game.',
    type: SpotifyTrackDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/random-track')
  getRandomTrack() {
    return this.hitstarService.getRandomTrack();
  }
}
