import { SharedIdentifiersService } from '@backend/shared-identifiers';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.guard';
import { extractTokenFromHeader } from './token-extraction';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private sharedIdentifiersService: SharedIdentifiersService,
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
    console.log(token);

    let identifierResponse;
    let isValid = true;
    try {
      identifierResponse = await this.sharedIdentifiersService.getIdentifier({
        id: token,
      });
      console.log(`Found identifier: ${identifierResponse}`);
    } catch (error) {
      isValid = false;
    }

    console.log(isValid);
    if (!isValid) {
      throw new UnauthorizedException(
        `User with id ${token} is unauthorized to ${request.method} request ressource ${request.url} without permission.`,
      );
    }
    return isValid;
  }
}
