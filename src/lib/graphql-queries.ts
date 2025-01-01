import request, { RequestOptions, Variables } from 'graphql-request';
import { TypedDocumentNode } from 'msw/core/graphql';

export * from './flag-queries.ts';
export * from './experiment-queries.ts';
export * from './environment-queries.ts';
export * from './sdk-connection-queries.ts';

/**
 * Get a query or mutation function to pass into react-query
 */
export const getRequestFunc = <T = unknown, V extends Variables = Variables>(
  document: TypedDocumentNode<T, V>,
  variables: RequestOptions<V, T>['variables'],
  options?: Omit<RequestOptions<V, T>, 'document' | 'variables'>,
) => {
  return async () => gqlRequest<T, V>(document, variables, options);
};

/**
 * Wrapper for graphql-request
 */
export const gqlRequest = <T = unknown, V extends Variables = Variables>(
  document: TypedDocumentNode<T, V>,
  variables: RequestOptions<V, T>['variables'],
  options?: Omit<RequestOptions<V, T>, 'document' | 'variables'>,
) => {
  return request({
    url: String(import.meta.env.VITE_GRAPHQL_SERVICE_URL),
    document: document as TypedDocumentNode<T, Variables>,
    variables: variables,
    ...options,
  });
};
