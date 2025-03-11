import {
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'npm:axios';
import { Observable, of } from 'npm:rxjs';

export const mockHttpResponse = (
  input: Partial<AxiosResponse>,
): Observable<AxiosResponse<typeof input>> => {
  return of({
    status: input?.status || 200,
    statusText: input?.statusText || 'OK',
    data: input?.data || {
      name: 'foo',
      status: 'bar',
    },
    headers: input?.headers || ({} as AxiosHeaders),
    config: input?.config || ({} as InternalAxiosRequestConfig),
  });
};
