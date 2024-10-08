import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  /**
   * Middleware to log incoming requests.
   *
   * @param req The incoming request.
   * @param res The response to be sent.
   * @param next The next function to be called.
   */
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const { id, url, method, query, context, headers } = req;
    this.logger.log(
      { req: { id, method, url, query, headers }, context },
      `⬇️  ${method} Incoming request`,
    );
    next();
  }
}
