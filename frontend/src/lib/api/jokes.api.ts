import { dev } from '$app/environment';
import type { JokeDto, JokeEditDto } from '$lib/types/jokes.dto';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export async function getJokeOfTheDay(): Promise<JokeDto> {
  return await fetch(`${apiURL}/jokes/random`).then((res) => res.json());
}

export async function getJokes(token: string): Promise<JokeDto[]> {
  return await fetch(`${apiURL}/jokes`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
}

export async function createJoke(
  token: string,
  jokeEditDto: JokeEditDto
): Promise<JokeDto> {
  return await fetch(`${apiURL}/jokes`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(jokeEditDto),
  }).then((res) => res.json());
}

export async function getJoke(token: string, id: string): Promise<JokeDto> {
  return await fetch(`${apiURL}/jokes/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
}

export async function updateJoke(
  token: string,
  id: string,
  jokeEditDto: JokeEditDto
): Promise<JokeDto> {
  return await fetch(`${apiURL}/jokes/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(jokeEditDto),
  }).then((res) => res.json());
}

export async function deleteJoke(token: string, id: string): Promise<JokeDto> {
  return await fetch(`${apiURL}/jokes/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
}
