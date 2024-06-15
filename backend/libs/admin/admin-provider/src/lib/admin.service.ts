import { OutputVerifyAdmin } from '@backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(private configService: ConfigService) {}

  /**
   * Verifies if the input id is the admin identifier.
   *
   * @param id The id to verify.
   * @returns True if the id is the admin identifier, false otherwise.
   */
  async verifyAdmin(id: string): Promise<OutputVerifyAdmin> {
    this.logger.log(`Verifying admin for input id ${id}.`);
    const isAdmin = this.configService.get('ADMIN_IDENTIFIER') === id;
    return { isAdmin };
  }
}
