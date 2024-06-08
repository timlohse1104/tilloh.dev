import { JokesService } from '@backend/jokes/jokes-provider';
import { JokeDto, ModifyJokeDto } from '@backend/shared-types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
    type: JokeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/random')
  getRandomJoke() {
    return this.jokesService.getRandomJoke();
  }

  @ApiOkResponse({
    description: 'Jokes.',
    type: [JokeDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/')
  listJokes() {
    return this.jokesService.listJokes();
  }

  @ApiOkResponse({
    description: 'Joke by id.',
    type: JokeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/:id')
  getJoke(@Param('id') id: string) {
    return this.jokesService.getJoke(id);
  }

  @ApiOkResponse({
    description: 'Joke created.',
    type: JokeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post('/')
  createJoke(@Body() modifyJokeDto: ModifyJokeDto) {
    return this.jokesService.createJoke(modifyJokeDto);
  }

  @ApiOkResponse({
    description: 'Joke updated.',
    type: JokeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Put('/:id')
  updateJoke(@Param('id') id: string, @Body() modifyJokeDto: ModifyJokeDto) {
    return this.jokesService.updateJoke(id, modifyJokeDto);
  }

  @ApiOkResponse({
    description: 'Joke deleted.',
    type: JokeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Delete('/:id')
  deleteJoke(@Param('id') id: string) {
    return this.jokesService.deleteJoke(id);
  }
}
