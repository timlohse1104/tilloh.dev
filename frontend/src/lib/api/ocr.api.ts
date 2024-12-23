import { dev } from '$app/environment';
import type { OcrSpaceResponseDto } from '$lib/types/ocr-space.dto';
import { environment } from '$lib/util/environment';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

export const executeOcrProcess = async (
  file: File,
): Promise<OcrSpaceResponseDto> => {
  const formData = new FormData();
  formData.set('file', file);

  return await fetch(`${apiURL}/ocr`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());
};
