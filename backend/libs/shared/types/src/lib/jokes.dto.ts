import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JokeDto {
  @ApiProperty({ description: 'Joke text' })
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Language abbreviation' })
  @IsNotEmpty()
  language: string;
}

export class JokesDto {
  @ApiProperty({ description: 'Jokes list' })
  jokes: JokeDto[];
}

export class CategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Language abbreviation' })
  @IsNotEmpty()
  languague: string;
}

export class CategoriesDto {
  @ApiProperty({ description: 'Categories list' })
  categories: CategoryDto[];
}

export class ModifyJokeDto extends JokeDto {
  @ApiProperty({ description: 'Joke categories' })
  @IsNotEmpty()
  categories: CategoryDto[];
}
