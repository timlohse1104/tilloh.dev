import { AdminProviderModule } from '@backend/admin-provider';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

@Module({
  imports: [AdminProviderModule],
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminControllerModule {}
