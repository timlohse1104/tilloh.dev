export interface SpotifyTrackDto {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumCover: string;
  releaseYear: number;
  spotifyUrl: string;
  previewUrl: string | null;
}

export interface HitstarRoundResult {
  round: number;
  track: SpotifyTrackDto;
  guessedYear: number;
  correct: boolean;
}

export interface HitstarBestRound {
  score: number;
  date: string;
}

export interface HitstarGameState {
  currentRound: number;
  score: number;
  currentTrack: SpotifyTrackDto | null;
  roundResults: HitstarRoundResult[];
}
