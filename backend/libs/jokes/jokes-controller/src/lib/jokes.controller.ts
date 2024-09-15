import { JokesService } from '@backend/jokes/jokes-provider';
import { JokeDto, ModifyJokeDto } from '@backend/shared-types';
import { Public } from '@backend/util';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('jokes')
@Controller('/jokes')
export class JokesController {
  constructor(private jokesService: JokesService) {}

  @Public()
  @ApiOkResponse({
    description: 'Random verified joke.',
    type: JokeDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/random')
  getRandomJoke() {
    return this.jokesService.getRandomJoke();
  }

  @Public()
  @ApiOkResponse({
    description: 'Daily verified joke rotated every night.',
    type: JokeDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/daily')
  getJokeOfTheDay() {
    return this.jokesService.getJokeOfTheDay();
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Jokes.',
    type: [JokeDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/')
  listJokes(@Query() filter?: JokeDto) {
    const filterQuery = filter || {};
    return this.jokesService.listJokes(filterQuery);
  }

  @ApiBearerAuth()
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

  @Public()
  @ApiBearerAuth()
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

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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
