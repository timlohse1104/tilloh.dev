import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector
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
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        `Unauthorized to ${request.method} request ressource ${request.url} without token.`,
        { description: `Provided no bearer token.` }
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
