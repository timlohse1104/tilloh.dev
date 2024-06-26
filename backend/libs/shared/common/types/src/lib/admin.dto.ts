import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InputVerifyAdmin {
  @ApiProperty()
  @IsString()
  id: string;
}

export class OutputVerifyAdmin {
  @ApiProperty()
  isAdmin: boolean;
}
