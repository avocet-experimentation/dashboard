import {
  QueriesOptions,
  QueriesResults,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
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
      variables: variables ?? {},
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
  cacheKey: any[],
  query: RequestDocument | TypedDocumentNode<T, V>,
  variables?: V,
  headers?: H,
) {
  const queryData = useQuery({
    queryKey: cacheKey,
    queryFn: getRequestFunc(query, variables, headers),
  });

  return queryData;
}

/**
 * Hook to simplify react-query useMutation calls
 * see https://tanstack.com/query/latest/docs/framework/react/guides/mutations
 */
export function useGQLMutation<
  T,
  A,
  H extends RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'],
>({
  mutation,
  cacheKey,
  headers,
  onSuccess,
  onError,
  onSettled,
}: {
  mutation: RequestDocument | TypedDocumentNode<T, V>;
  /** Passing a key will cause its data to be invalidated upon mutation success */
  cacheKey?: string[];
  headers?: H;
  onSuccess?: (data: T, variables: V, context: unknown) => void | Promise<void>;
  onError?: (
    error: Error,
    variables: V,
    context: unknown,
  ) => void | Promise<void>;
  onSettled?: (
    data: unknown,
    error: Error | null,
    variables: V,
    context: unknown,
  ) => void;
}) {
  const queryClient = useQueryClient();

  const mutationData = useMutation({
    mutationFn: (args: V) => {
      return request({
        url: String(import.meta.env.VITE_GRAPHQL_SERVICE_URL),
        document: mutation,
        variables: args,
        requestHeaders: headers,
      });
    },
    async onSuccess(data: T, variables: V, context: unknown) {
      if (cacheKey) {
        await queryClient.invalidateQueries(
          { queryKey: cacheKey, refetchType: 'all' },
          { throwOnError: true, cancelRefetch: true },
        );
      }

      await onSuccess?.(data, variables, context);
    },
    onError,
    onSettled,
  });
  return mutationData;
}
