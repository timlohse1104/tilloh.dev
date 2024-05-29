import { dev } from '$app/environment';
import type { JokeDto } from '$lib/types/jokes.dto';
import { environment } from '$lib/util/environment';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export class JokeApi {
  async getRandomJoke(): Promise<JokeDto> {
    return await fetch(`${apiURL}/jokes/random`).then((res) => res.json());
  }
}
