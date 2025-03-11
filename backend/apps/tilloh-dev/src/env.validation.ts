import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  SERVER_ADDRESS: string;

  @IsString()
  GLOBAL_PREFIX: string;

  @IsNumber()
  PORT: number;

  @IsString()
  MONGO_DB_URL: string;

  @IsString()
  ADMIN_IDENTIFIER: string;

  @IsString()
  OCR_SPACE_URL: string;

  @IsString()
  OCR_SPACE_API_KEY: string;
}

export function validate(
  EnvironmentVariablesClass,
  config?: Record<string, unknown>,
) {
  const validatedConfig: never = plainToInstance(
    EnvironmentVariablesClass,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
