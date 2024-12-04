import { RequestOptions, ResponseTypes } from './fetchTypes';

export const defaultJsonHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  mode: 'cors',
};

export const credentialsRequestOptions: RequestOptions = {
  credentials: 'include',
};

export function encodeToJson(body?: unknown) {
  if (!body) return null;
  return JSON.stringify(body);
}

export async function handleJsonResponse<T>(
  response: Response,
): Promise<ResponseTypes<T>> {
  if (!response.ok) {
    return { ...response, ok: false };
  }
  const parsed: T = await response.json();
  return { ...response, ok: true, body: parsed };
}
