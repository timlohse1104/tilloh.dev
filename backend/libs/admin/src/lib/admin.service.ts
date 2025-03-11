import { IdentifiersService } from '@backend/shared-identifiers';
import { InputVerifyAdmin, OutputVerifyAdmin } from '@backend/shared-types';
import { Injectable, Logger } from 'npm:@nestjs/common';
import { ConfigService } from 'npm:@nestjs/config';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    private configService: ConfigService,
    private identifiersService: IdentifiersService,
  ) {}

  /**
   * Verifies if the input id is the admin identifier.
   *
   * @param inputVerifyAdmin Id and type of the user to verify.
   * @returns True if the id is the admin identifier, false otherwise.
   */
  async verifyAdmin(
    inputVerifyAdmin: InputVerifyAdmin,
  ): Promise<OutputVerifyAdmin> {
    const { id, type } = inputVerifyAdmin;
    const isAdmin = type === 'admin';

    this.logger.log(
      `Verifying ${isAdmin ? 'admin' : 'user'} for input id '${id}'.`,
    );
    let isVerified = false;

    if (isAdmin) {
      isVerified = this.configService.get('ADMIN_IDENTIFIER') === id;
    } else {
      try {
        const identifier = await this.identifiersService.getIdentifier({ id });
        this.logger.log(`Found identifier with name '${identifier?.name}'.`);
        isVerified = true;
      } catch (error) {
        this.logger.warn(`Identifier with id '${id}' could not be verified.`);
        isVerified = false;
      }
    }

    return { isVerified };
  }
}
