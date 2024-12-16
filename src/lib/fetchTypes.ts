import { SafeOmit } from '@avocet/core';

/**
 * Options to configure requests, excluding headers and body.
 * See https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
 */
export type RequestOptions = SafeOmit<
  RequestInit,
  'headers' | 'body' | 'signal'
>;

export type FailedResponse = Omit<Response, 'ok'> & { ok: false };

export type ParsedResponse<T> = Omit<Response, 'body'> & {
  ok: true;
  body: T;
};

export type ResponseTypes<T> = FailedResponse | ParsedResponse<T>;
export type BodyEncoder = (body: unknown) => BodyInit | null;
export type ResponseHandler = <T>(
  response: Response,
) => Promise<FailedResponse | ParsedResponse<T>>;

export interface GQLSuccessResponseBody<T> {
  data: Record<string, T>;
  errors?: object[]; // todo: replace placeholder type
}

export interface GQLFailureResponseBody<T> {
  data?: Record<string, T>;
  errors: object[]; // todo: replace placeholder type
}

export type GQLResponseBody<T> =
  | GQLSuccessResponseBody<T>
  | GQLFailureResponseBody<T>;

type GQLResponseBase<T> = Omit<Response, 'ok' | 'body'> & {
  ok: boolean;
  body: GQLResponseBody<T>;
};

export interface GQLSuccessResponse<T> extends GQLResponseBase<T> {
  ok: true;
  body: GQLSuccessResponseBody<T>;
}

export interface GQLFailureResponse<T> extends GQLResponseBase<T> {
  ok: false;
  body: GQLFailureResponseBody<T>;
}

export type GQLResponse<T> = GQLSuccessResponse<T> | GQLFailureResponse<T>;

export interface GQLParsedSuccessResponse<T> {
  ok: true;
  body: T;
  errors?: object[];
}

export interface GQLParsedFailureResponse<T> {
  ok: false;
  body?: T;
  errors: object[];
}
/**
 *
 */
export type GQLParsedResponse<T> =
  | GQLParsedSuccessResponse<T>
  | GQLParsedFailureResponse<T>;

// /**
//  * When multiple types of data are fetched at once
//  */
// export type GQLParsedCompoundResponse<U, T extends U> = GQLParsedResponse<
//   Record<AvocetMongoCollectionName, T>
// >;
