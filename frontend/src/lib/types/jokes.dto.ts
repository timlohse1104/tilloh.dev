export class JokeDto {
  _id!: string;
  text!: string;
  language!: string;
  created!: Date;
  updated!: Date;
}

export class JokeEditDto {
  text: string;
  language: string;
  categories: string[];
}
