import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from './admin.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminProviderModule {}
