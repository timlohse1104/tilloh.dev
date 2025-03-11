import { SharedIdentifiersModule } from '@backend/shared-identifiers';
import { Module } from 'npm:@nestjs/common';
import { ConfigModule } from 'npm:@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [SharedIdentifiersModule, ConfigModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
