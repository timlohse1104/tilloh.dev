import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class JokeDto {
  @ApiProperty({ description: 'Joke text', required: false })
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Language abbreviation', required: false })
  @IsNotEmpty()
  language: string;

  @ApiProperty({ description: 'Chat creation date', required: false })
  @IsOptional()
  created: Date;

  @ApiProperty({ description: 'Chat update date', required: false })
  @IsOptional()
  updated: Date;

  @ApiProperty({ description: 'Joke verification status', required: false })
  @IsOptional()
  verified: boolean;
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
