import { InputVerifyAdmin, OutputVerifyAdmin } from '@backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(private configService: ConfigService) {}

  /**
   * Verifies if the input id is the admin identifier.
   *
   * @param inputVerifyAdmin Id and type of the user to verify.
   * @returns True if the id is the admin identifier, false otherwise.
   */
  verifyAdmin(inputVerifyAdmin: InputVerifyAdmin): OutputVerifyAdmin {
    const { id, type } = inputVerifyAdmin;
    const isAdmin = type === 'admin';

    this.logger.log(
      `Verifying ${isAdmin ? 'admin' : 'user'} for input id ${id}.`,
    );
    let isVerified = false;

    if (isAdmin) {
      isVerified = this.configService.get('ADMIN_IDENTIFIER') === id;
    } else {
      // TODO: Refactor identifier into shared library and implement logic here
      const identifier = false;
    }

    return { isVerified };
  }
}
