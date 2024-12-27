import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InputVerifyAdmin {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  type: 'user' | 'admin';
}

export class OutputVerifyAdmin {
  @ApiProperty()
  isVerified: boolean;
}
