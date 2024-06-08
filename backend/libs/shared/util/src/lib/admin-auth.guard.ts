import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        `Unauthorized to request ressource ${request.url} without token.`,
        { description: `Provided no bearer token.` }
      );
    }

    const adminIdentifier = this.configService.get('ADMIN_IDENTIFIER');
    const isValid = token === adminIdentifier;
    if (!isValid) {
      throw new UnauthorizedException(
        `Unauthorized to request ressource ${request.url} without permission.`,
        { description: `Provided bearer token: ${token}` }
      );
    }
    return isValid;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
