// import { SafeOmit } from '@avocet/core';

import { defaultJsonHeaders } from './fetchHelpers';
import { RequestOptions, GQLResponse } from './fetchTypes';

/**
 * Streamlines GraphQL fetch requests.
 * Allows headers and other request options to be specified in advance.
 */
export default class GraphQLFetchWrapper {
  gqlUrl: string;
  defaultRequestOptions: RequestOptions;
  defaultHeaders: HeadersInit;

  constructor({
    gqlUrl,
    defaultHeaders,
    defaultRequestOptions,
  }: {
    // the endpoint to make GraphQL requests to
    gqlUrl: string;
    // headers to include in all requests
    defaultHeaders?: HeadersInit;
    defaultRequestOptions?: RequestOptions;
  }) {
    this.gqlUrl = gqlUrl;
    this.defaultHeaders = { ...defaultHeaders, ...defaultJsonHeaders };
    this.defaultRequestOptions = { ...defaultRequestOptions };
  }

  query<T>(query: string, headers: HeadersInit = this.defaultHeaders) {
    return this.#send<T>({ query: `query { ${query} }` }, headers);
  }

  mutate<T>(mutation: string, headers: HeadersInit = this.defaultHeaders) {
    return this.#send<T>({ query: `mutation { ${mutation} }` }, headers);
  }

  async #send<T>(
    body?: unknown,
    headers?: HeadersInit,
  ): Promise<GQLResponse<T>> {
    const requestOptions = {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...headers },
      body: JSON.stringify(body),
    };
    const response = await fetch(this.gqlUrl, requestOptions);
    if (!response.ok) {
      // todo: this condition shouldn't be reachable
      throw new Error(`GraphQL request failed: ${JSON.stringify(response)}`);
    }

    const data = await response.json();
    if ('errors' in response) {
      return { ...response, ok: false, body: data };
    }
    return { ...response, ok: true, body: data };
  }
}
