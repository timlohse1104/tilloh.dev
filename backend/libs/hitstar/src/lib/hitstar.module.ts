import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HitstarController } from './hitstar.controller';
import { HitstarService } from './hitstar.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [HitstarController],
  providers: [HitstarService],
  exports: [],
})
export class HitstarModule {}
