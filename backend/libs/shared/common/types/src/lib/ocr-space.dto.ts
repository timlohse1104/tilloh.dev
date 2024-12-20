import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

class OcrSpaceWordDto {
  @ApiProperty()
  @IsNotEmpty()
  WordText: string;

  @ApiProperty()
  @IsNotEmpty()
  Height: number;

  @ApiProperty()
  @IsNotEmpty()
  Left: number;

  @ApiProperty()
  @IsNotEmpty()
  Top: number;

  @ApiProperty()
  @IsNotEmpty()
  Width: number;
}

class OcrSpaceLineDto {
  @ApiProperty()
  @IsNotEmpty()
  LineText: string;

  @ApiProperty({ type: [OcrSpaceWordDto] })
  @IsNotEmpty()
  Words: OcrSpaceWordDto[];

  @ApiProperty()
  @IsNotEmpty()
  MaxHeight: number;

  @ApiProperty()
  @IsNotEmpty()
  MinTop: number;
}

class OcrSpaceTextoverlayDto {
  @ApiProperty()
  @IsNotEmpty()
  Lines: OcrSpaceLineDto[];

  @ApiProperty()
  @IsNotEmpty()
  HasOverlay: boolean;

  @ApiProperty()
  @IsOptional()
  Message?: string;
}

class OcrSpaceParsedResultDto {
  @ApiProperty()
  @IsNotEmpty()
  TextOverlay: OcrSpaceTextoverlayDto;

  @ApiProperty()
  @IsNotEmpty()
  TextOrientation: string;

  @ApiProperty()
  @IsNotEmpty()
  FileParseExitCode: number;

  @ApiProperty()
  @IsNotEmpty()
  ParsedText: string;

  @ApiProperty()
  @IsNotEmpty()
  ErrorMessage: string;

  @ApiProperty()
  @IsNotEmpty()
  ErrorDetails: string;
}

export class OcrSpaceResponseDto {
  @ApiProperty({ type: [OcrSpaceParsedResultDto] })
  @IsNotEmpty()
  ParsedResults: OcrSpaceParsedResultDto[];

  @ApiProperty()
  @IsNotEmpty()
  OCRExitCode: number;

  @ApiProperty()
  @IsNotEmpty()
  IsErroredOnProcessing: boolean;

  @ApiProperty()
  @IsOptional()
  ErrorMessage?: string;

  @ApiProperty()
  @IsOptional()
  ErrorDetails?: string;

  @ApiProperty()
  @IsOptional()
  SearchablePDFURL?: string;

  @ApiProperty()
  @IsNotEmpty()
  ProcessingTimeInMilliseconds: string;
}
