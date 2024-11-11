import { dev } from '$app/environment';
import type { OcrSpaceResponseDto } from '$lib/types/ocr-space.dto';
import { environment } from '$lib/util/environment';
import { createHeaders } from './helper';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export const executeOcrProcess = async (
  file: File,
): Promise<OcrSpaceResponseDto> => {
  return await fetch(`${apiURL}/ocr`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify({ file }),
  }).then((res) => res.json());
};
