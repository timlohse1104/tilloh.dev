import { JokeDto } from '@backend/shared-types';

export const mockJokeDto = (mock: Partial<JokeDto>): JokeDto => ({
  text: mock.text || 'mockText',
  language: mock.language || 'mockLanguage',
  created: mock?.created || new Date(),
  updated: mock?.updated || new Date(),
});
