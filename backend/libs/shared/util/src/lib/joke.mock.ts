import { JokeDto } from "@backend/shared-types";

export const mockJokeDto = (mock: Partial<JokeDto>): JokeDto => ({
  text: mock.text || 'mockText',
  language: mock.language || 'mockLanguage',
});
