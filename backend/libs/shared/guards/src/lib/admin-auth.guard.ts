import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.guard';
import { extractTokenFromHeader } from './token-extraction';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        `Unauthorized to ${request.method} request ressource ${request.url} without token.`,
        { description: `Provided no bearer token.` },
      );
    }

    const adminIdentifier = this.configService.get('ADMIN_IDENTIFIER');
    console.log(token);
    console.log(adminIdentifier);
    const isValid = token === adminIdentifier;
    console.log(isValid);
    if (!isValid) {
      throw new UnauthorizedException(
        `Unauthorized to ${request.method} request ressource ${request.url} without permission.`,
        { description: `Provided bearer token: ${token}` },
      );
    }
    return isValid;
  }
}
