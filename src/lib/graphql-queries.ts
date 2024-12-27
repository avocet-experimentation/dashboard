import {
  QueriesOptions,
  QueriesResults,
  useMutation,
  useQueries,
  useQuery,
} from '@tanstack/react-query';
import request, { RequestDocument, RequestOptions } from 'graphql-request';
import { TypedDocumentNode } from 'msw/core/graphql';

export * from './flag-queries.ts';

export const getRequestFunc = <
  T,
  H extends RequestOptions['requestHeaders'] = RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'] = RequestOptions['variables'],
>(
  query: RequestDocument | TypedDocumentNode<T, V>,
  variables?: V,
  headers?: H,
) => {
  return async () =>
    request({
      url: String(import.meta.env.VITE_GRAPHQL_SERVICE_URL),
      document: query,
      variables,
      requestHeaders: headers,
    });
};

/**
 *  Hook to simplify react-query useQuery calls
 */
export function useGQLQuery<
  T,
  H extends RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'],
>(
  cacheKey: string,
  query: RequestDocument | TypedDocumentNode<T, V>,
  variables?: V,
  headers?: H,
) {
  const queryData = useQuery({
    queryKey: [cacheKey],
    queryFn: getRequestFunc(query, variables, headers),
  });

  return queryData;
}

/**
 * Hook to simplify react-query useMutation calls
 */
export function useGQLMutation<
  T,
  A,
  H extends RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'],
>({
  mutation,
  // getVariablesFunc,
  headers,
  onSuccess,
  onError,
  onSettled,
}: {
  mutation: RequestDocument | TypedDocumentNode<T, V>;
  // getVariablesFunc: (...args: A[]) => V;
  headers?: H;
  onSuccess?: (data: T, variables: V, context: unknown) => void;
  onError?: (error: Error, variables: V, context: unknown) => void;
  onSettled?: (
    data: unknown,
    error: Error | null,
    variables: V,
    context: unknown,
  ) => void;
}) {
  // see https://tanstack.com/query/latest/docs/framework/react/guides/mutations
  const mutationData = useMutation({
    mutationFn: (args: V) => {
      // const variables = getVariablesFunc(...args);

      return request({
        url: String(import.meta.env.VITE_GRAPHQL_SERVICE_URL),
        document: mutation,
        variables: args,
        requestHeaders: headers,
      });
    },
    onSuccess,
    onError,
    onSettled,
  });
  return mutationData;
}
