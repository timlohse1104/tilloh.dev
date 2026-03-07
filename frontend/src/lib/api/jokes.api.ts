import type { JokeDto, JokeEditDto } from '$lib/types/jokes.dto';
import { getApiURL } from '$lib/util/environment';
import { createHeaders } from './helper';


export const getRandomJoke = async (): Promise<JokeDto> => {
  return await fetch(`${getApiURL()}/jokes/random`).then((res) => res.json());
};

export const getJokeOfTheDay = async (): Promise<JokeDto> => {
  return await fetch(`${getApiURL()}/jokes/daily`).then((res) => res.json());
};

export const getJokes = async (token: string): Promise<JokeDto[]> => {
  return await fetch(`${getApiURL()}/jokes`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const createJoke = async (
  jokeEditDto: JokeEditDto,
): Promise<JokeDto> => {
  return await fetch(`${getApiURL()}/jokes`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(jokeEditDto),
  }).then((res) => res.json());
};

export const getJoke = async (token: string, id: string): Promise<JokeDto> => {
  return await fetch(`${getApiURL()}/jokes/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
  }).then((res) => res.json());
};

export const updateJoke = async (
  token: string,
  id: string,
  jokeEditDto: Partial<JokeEditDto>,
): Promise<JokeDto> => {
  return await fetch(`${getApiURL()}/jokes/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(jokeEditDto),
  }).then((res) => res.json());
};

export const deleteJoke = async (
  token: string,
  id: string,
): Promise<JokeDto> => {
  return await fetch(`${getApiURL()}/jokes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};
