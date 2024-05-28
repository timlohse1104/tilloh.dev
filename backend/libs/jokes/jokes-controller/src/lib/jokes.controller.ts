import { JokesService } from '@backend/jokes/jokes-provider';
import { JokeDto } from '@backend/shared/types';
import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('jokes')
@Controller('/jokes')
export class JokesController {
  constructor(private jokesService: JokesService) {}

  @ApiOkResponse({
    description: 'Random joke rotated daily.',
    type: [JokeDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/random')
  getRandomJoke() {
    return this.jokesService.getRandomJoke();
  }
}
