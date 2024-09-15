import { dev } from '$app/environment';
import type { JokeDto, JokeEditDto } from '$lib/types/jokes.dto';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export const getRandomJoke = async (): Promise<JokeDto> => {
  return await fetch(`${apiURL}/jokes/random`).then((res) => res.json());
};

export const getJokeOfTheDay = async (): Promise<JokeDto> => {
  return await fetch(`${apiURL}/jokes/daily`).then((res) => res.json());
};

export const getJokes = async (token: string): Promise<JokeDto[]> => {
  return await fetch(`${apiURL}/jokes`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const createJoke = async (
  jokeEditDto: JokeEditDto,
): Promise<JokeDto> => {
  return await fetch(`${apiURL}/jokes`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(jokeEditDto),
  }).then((res) => res.json());
};

export const getJoke = async (token: string, id: string): Promise<JokeDto> => {
  return await fetch(`${apiURL}/jokes/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const updateJoke = async (
  token: string,
  id: string,
  jokeEditDto: JokeEditDto,
): Promise<JokeDto> => {
  return await fetch(`${apiURL}/jokes/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(jokeEditDto),
  }).then((res) => res.json());
};

export const deleteJoke = async (
  token: string,
  id: string,
): Promise<JokeDto> => {
  return await fetch(`${apiURL}/jokes/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  }).then((res) => res.json());
};
