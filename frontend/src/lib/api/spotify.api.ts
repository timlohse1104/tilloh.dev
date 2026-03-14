import type { SpotifyTrackDto } from '$lib/types/spotify.dto';
import { getApiURL } from '$lib/util/environment';

export const getRandomTrack = async (): Promise<SpotifyTrackDto> => {
  const res = await fetch(`${getApiURL()}/hitstar/random-track`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
};
