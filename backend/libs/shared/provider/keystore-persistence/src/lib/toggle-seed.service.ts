import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { KeystoreMongoDbService } from './keystore-mongodb.service';
import {
  TOGGLE_IDENTIFIER,
  TOGGLE_SEED_CONFIG,
} from './toggle-seed.config';

@Injectable()
export class ToggleSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ToggleSeedService.name);

  constructor(private readonly keystoreService: KeystoreMongoDbService) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.debug('Starting toggle seed check...');

    const existingToggles = await this.keystoreService.findAll({
      identifier: TOGGLE_IDENTIFIER,
    });

    const existingKeys = new Set(existingToggles.map((t) => t.key));

    let created = 0;
    let alreadyExisted = 0;

    for (const entry of TOGGLE_SEED_CONFIG) {
      if (existingKeys.has(entry.key)) {
        alreadyExisted++;
        continue;
      }

      try {
        await this.keystoreService.create(
          TOGGLE_IDENTIFIER,
          entry.key,
          entry.defaultValue,
        );
        this.logger.debug(`Toggle created: ${entry.key}=${entry.defaultValue}`);
        created++;
      } catch (error) {
        this.logger.error(
          `Failed to create toggle ${entry.key}: ${(error as Error).message}`,
        );
      }
    }

    this.logger.log(
      `Toggle seed complete: ${created} created, ${alreadyExisted} already existed.`,
    );
  }
}
