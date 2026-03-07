import type { OcrSpaceResponseDto } from '$lib/types/ocr-space.dto';
import { getApiURL } from '$lib/util/environment';


export const executeOcrProcess = async (
  file: File,
): Promise<OcrSpaceResponseDto> => {
  const formData = new FormData();
  formData.set('file', file);

  return await fetch(`${getApiURL()}/ocr`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());
};
