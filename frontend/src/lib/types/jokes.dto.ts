export class JokeDto {
  _id!: string;
  text!: string;
  language!: string;
  created!: string;
  updated!: string;
}

export class JokeEditDto {
  text: string;
  language: string;
  categories: string[];
}
