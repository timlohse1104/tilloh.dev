import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// TODO: Deployment counter: 1

export class InputVerifyAdmin {
  @ApiProperty()
  @IsString()
  id: string;
}

export class OutputVerifyAdmin {
  @ApiProperty()
  isAdmin: boolean;
}
