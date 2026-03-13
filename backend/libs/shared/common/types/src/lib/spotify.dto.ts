import { ApiProperty } from '@nestjs/swagger';

export class SpotifyTrackDto {
  @ApiProperty({ description: 'Spotify track ID' })
  id: string;

  @ApiProperty({ description: 'Track name' })
  name: string;

  @ApiProperty({ description: 'Comma-separated artist names' })
  artist: string;

  @ApiProperty({ description: 'Album name' })
  album: string;

  @ApiProperty({ description: 'Album cover image URL' })
  albumCover: string;

  @ApiProperty({ description: 'Release year of the track' })
  releaseYear: number;

  @ApiProperty({ description: 'Spotify track URL' })
  spotifyUrl: string;

  @ApiProperty({ description: '30-second MP3 preview URL (null if not available)' })
  previewUrl: string | null;
}
