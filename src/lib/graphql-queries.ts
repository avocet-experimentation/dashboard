import { RequestOptions, Variables, GraphQLClient } from 'graphql-request';
import { TypedDocumentNode } from 'msw/core/graphql';
import { auth0Client } from './UseAuth.tsx';
export * from './flag-queries.ts';
export * from './experiment-queries.ts';
export * from './environment-queries.ts';
export * from './sdk-connection-queries.ts';

const gqlClient = new GraphQLClient(
  String(import.meta.env.VITE_GRAPHQL_SERVICE_URL),
  {
    // credentials: 'include', TODO: re-enable once setting Access-Control-Allow-Origin on server
    mode: 'cors',
  },
);
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
  const accessToken = await auth0Client.getTokenSilently({});
  const result = await gqlClient.request({
    requestHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    document: document as TypedDocumentNode<T, Variables>,
    variables: variables,
    ...options,
  });

  const opName = Object.keys(result)[0];
  return result[opName as keyof Omit<typeof result, '__typename'>];
};
