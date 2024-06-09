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
  async verifyAdmin(id: string): Promise<boolean> {
    this.logger.log(`Verifying admin for input id ${id}.`);
    return this.configService.get('ADMIN_IDENTIFIER') === id;
  }
}
