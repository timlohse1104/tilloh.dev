import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [],
})
export class SpotifyModule {}
