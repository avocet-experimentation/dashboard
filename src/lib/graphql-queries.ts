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
  H extends RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'],
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
 * (WIP) Hook to simplify react-query useMutation calls
 */
export function useGQLMutation<
  T,
  H extends RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'],
>({
  mutation,
  variables,
  headers,
}: {
  mutation: RequestDocument | TypedDocumentNode<T, V>;
  variables?: V;
  headers?: H;
}) {
  // see https://tanstack.com/query/latest/docs/framework/react/guides/mutations
  const mutationData = useMutation({
    mutationFn: getRequestFunc(mutation, variables, headers),
    onSuccess: (data, variables, context) => {
      console.log({ data });
      const updated = data.updateEnvironment;
      if (updated === null) return;
      setEnv(updated);
    },
    onError: (error, variables, context) => {},
    onSettled: (data, error, variables, context) => {},
  });

  return mutationData;
}

interface UseGQLQueryParams<
  T = any,
  H extends RequestOptions['requestHeaders'] = RequestOptions['requestHeaders'],
  V extends RequestOptions['variables'] = RequestOptions['variables'],
> {
  cacheKey: string;
  query: RequestDocument | TypedDocumentNode<T, V>;
  variables?: V;
  headers?: H;
}

/**
 * (WIP) Combine many queries into one for convenience.
 *
 * todo:
 * - fix typing of outputs
 */
function useGQLQueries<
  T extends Array<any>,
  TCombinedResult = QueriesResults<T>,
>(paramSets: [UseGQLQueryParams, ...UseGQLQueryParams[]]) {
  if (paramSets.length === 0) {
    throw new TypeError('Must pass at least one set of query arguments');
  }

  const queries: [...QueriesOptions<T>] = paramSets.map(
    ({ cacheKey, query, variables, headers }) => ({
      queryKey: [cacheKey],
      queryFn: getRequestFunc(query, variables, headers),
    }),
  ) as [...QueriesOptions<T>];

  const results = useQueries<T, TCombinedResult>({
    queries,
  });

  const isPending = results.some((query) => query.isPending);
  const isError = results.some((query) => query.isError);
  const isSuccess = results.every((query) => query.isSuccess);
  const data = results.reduce(
    (acc, query) => (query.isSuccess ? Object.assign(acc, query.data) : acc),
    {},
  );

  return {
    isPending,
    isError,
    isSuccess,
    data,
  };
}
