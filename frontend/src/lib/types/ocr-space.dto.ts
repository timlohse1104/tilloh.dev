class OcrSpaceWordDto {
  WordText: string;
  Height: number;
  Left: number;
  Top: number;
  Width: number;
}

class OcrSpaceLineDto {
  LineText: string;
  Words: OcrSpaceWordDto[];
  MaxHeight: number;
  MinTop: number;
}

class OcrSpaceTextoverlayDto {
  Lines: OcrSpaceLineDto[];
  HasOverlay: boolean;
  Message?: string;
}

class OcrSpaceParsedResultDto {
  TextOverlay: OcrSpaceTextoverlayDto;
  TextOrientation: string;
  FileParseExitCode: number;
  ParsedText: string;
  ErrorMessage: string;
  ErrorDetails: string;
}

export class OcrSpaceResponseDto {
  ParsedResults: OcrSpaceParsedResultDto[];
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
  ErrorDetails?: string;
  SearchablePDFURL?: string;
  ProcessingTimeInMilliseconds: string;
}
