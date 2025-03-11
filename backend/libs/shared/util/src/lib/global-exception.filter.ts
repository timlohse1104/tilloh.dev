import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from 'npm:@nestjs/common';
import { HttpAdapterHost } from 'npm:@nestjs/core';
import { InjectPinoLogger, PinoLogger } from 'npm:nestjs-pino';

// https://docs.nestjs.com/exception-filters#catch-everything
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @InjectPinoLogger(GlobalExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Method to implement a custom exception filter.
   *
   * @param exception The exception to be caught.
   * @param host The host of the application.
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const userId = request.user?.sub ?? 'unknown';
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpResponseData = exception?.['response']?.['data'] ?? null;
    const httpResponseMessage = exception?.['response']?.['message'] ?? null;

    this.logger.error(
      {
        req: { id: userId, body: request.body },
        info: exception?.['response'] ?? {},
      },
      exception?.['message'],
      GlobalExceptionFilter.name,
    );

    const responseBody = {
      statusCode: httpStatus,
      message: exception?.['message'],
      information: {
        data: httpResponseData,
        message: httpResponseMessage,
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
