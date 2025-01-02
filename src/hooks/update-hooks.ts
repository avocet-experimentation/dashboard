import { UPDATE_ENVIRONMENT, gqlRequest } from '#/lib/graphql-queries';
import { Environment, EnvironmentDraft } from '@avocet/core';
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

/**
 * Update operations for environments, SDK connections, and other simple types
 *
 */

export const useUpdateEnvironment = (
  environmentId: string,
  options?: UseMutationOptions<
    Environment | null,
    Error,
    Partial<EnvironmentDraft>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (partialEntry: Partial<EnvironmentDraft>) =>
      gqlRequest(UPDATE_ENVIRONMENT, {
        partialEntry: { ...partialEntry, id: environmentId },
      }),
    onSuccess: (data, variables, context) => {
      if (data === null) return;

      queryClient.setQueryData(
        ['allEnvironments'],
        (oldData: Environment[]) => {
          return oldData.map((env) => (env.id === environmentId ? data : env));
        },
      );

      return options?.onSuccess?.(data, variables, context);
    },
  });
};
