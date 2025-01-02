import request, { RequestOptions, Variables } from 'graphql-request';
import { TypedDocumentNode } from 'msw/core/graphql';
export * from './flag-queries.ts';
export * from './experiment-queries.ts';
export * from './environment-queries.ts';
export * from './sdk-connection-queries.ts';

/**
 * Get a query or mutation function to pass into react-query
 */
export const getRequestFunc = <
  T extends { [key: string]: any } = { [key: string]: any },
  V extends Variables = Variables,
>(
  document: TypedDocumentNode<T, V>,
  variables: RequestOptions<V, T>['variables'],
  options?: Omit<RequestOptions<V, T>, 'document' | 'variables'>,
) => {
  return async () => gqlRequest<T, V>(document, variables, options);
};

/**
 * Concisely make a single GraphQL query or mutation
 */
export const gqlRequest = async <
  T extends { [key: string]: any } = { [key: string]: any },
  V extends Variables = Variables,
>(
  document: TypedDocumentNode<T, V>,
  variables: RequestOptions<V, T>['variables'],
  options?: Omit<RequestOptions<V, T>, 'document' | 'variables'>,
) => {
  const result = await request({
    url: String(import.meta.env.VITE_GRAPHQL_SERVICE_URL),
    document: document as TypedDocumentNode<T, Variables>,
    variables: variables,
    ...options,
  });

  const opName = Object.keys(result)[0];
  return result[opName as keyof Omit<typeof result, '__typename'>];
};
