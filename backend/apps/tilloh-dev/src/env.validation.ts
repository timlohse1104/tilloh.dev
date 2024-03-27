import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, Matches, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @Matches(/^(development|production)$/)
  NODE_ENV: string;

  @IsString()
  GLOBAL_PREFIX: string;

  @IsNumber()
  PORT: number;

  @IsString()
  MONGO_DB_URL: string;

  @IsString()
  SERVER_ADDRESS: string;
}

export function validate(
  EnvironmentVariablesClass,
  config?: Record<string, unknown>
) {
  const validatedConfig: any = plainToInstance(
    EnvironmentVariablesClass,
    config,
    { enableImplicitConversion: true }
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
