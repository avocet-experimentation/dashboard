import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import request, { RequestOptions, Variables } from 'graphql-request';
import { TypedDocumentNode } from 'msw/core/graphql';

export * from './flag-queries.ts';

/**
 * Get a query or mutation function to pass into react-query
 */
export const getRequestFunc = <
  T = unknown,
  V extends Variables = Variables,
  // H extends RequestOptions['requestHeaders'] = RequestOptions['requestHeaders'],
>(
  document: TypedDocumentNode<T, V>,
  variables: RequestOptions<V, T>['variables'],
  options?: Omit<RequestOptions<V, T>, 'document' | 'variables'>,
) => {
  return async () => gqlRequest<T, V>(document, variables, options);
};

/**
 * Wrapper for graphql-request
 */
export const gqlRequest = <
  T = unknown,
  V extends Variables = Variables,
  // H extends RequestOptions['requestHeaders'] = RequestOptions['requestHeaders'],
>(
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

/** TODO: remove once no longer in use
 *  Hook to simplify react-query useQuery calls
 */
export function useGQLQuery<
  T,
  H extends RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'],
>(cacheKey: any[], query: TypedDocumentNode<T, V>, variables?: V, headers?: H) {
  const queryData = useQuery({
    queryKey: cacheKey,
    queryFn: getRequestFunc(query, variables, headers),
  });

  return queryData;
}

/** TODO: remove once no longer in use
 * Hook to simplify react-query useMutation calls
 * see https://tanstack.com/query/latest/docs/framework/react/guides/mutations
 */
export function useGQLMutation<
  T,
  A,
  H extends RequestOptions['requestHeaders'],
  V extends Variables = Variables,
>({
  mutation,
  cacheKey,
  headers,
  onSuccess,
  onError,
  onSettled,
}: {
  mutation: TypedDocumentNode<T, V>;
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
      return gqlRequest<T, V>(mutation, args, { requestHeaders: headers });
    },
    async onSuccess(data: T, variables: V, context: unknown) {
      await onSuccess?.(data, variables, context);
    },
    onError,
    onSettled,
  });
  return mutationData;
}
