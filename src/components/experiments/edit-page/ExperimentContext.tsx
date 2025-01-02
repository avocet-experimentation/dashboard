import {
  EXPERIMENT,
  UPDATE_EXPERIMENT,
  getRequestFunc,
  gqlRequest,
} from '#/lib/graphql-queries';
import { Experiment, ExperimentDraft } from '@avocet/core';
import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { createContext, useContext } from 'react';

/* Provides queries and mutations via the useExperimentContext hook */

export const useExperimentHook = (experimentId: string) =>
  useQuery({
    queryKey: ['experiment', experimentId],
    queryFn: getRequestFunc(EXPERIMENT, { id: experimentId }),
  });

const useUpdateExperimentHook = (
  experimentId: string,
  options?: UseMutationOptions<
    Experiment | null,
    Error,
    Partial<ExperimentDraft>
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: async (partialEntry: Partial<ExperimentDraft>) =>
      gqlRequest(UPDATE_EXPERIMENT, {
        partialEntry: { ...partialEntry, id: experimentId },
      }),
    mutationKey: ['experiment', experimentId],
  });
};

const defaults = {
  useExperiment: useExperimentHook.bind(undefined, ''),
  useUpdateExperiment: useUpdateExperimentHook.bind(undefined, ''),
};

const ExperimentContext = createContext<{
  useExperiment: () => ReturnType<typeof useExperimentHook>;
  useUpdateExperiment: (
    options?: Parameters<typeof useUpdateExperimentHook>[1],
  ) => ReturnType<typeof useUpdateExperimentHook>;
}>(defaults);

export function ExperimentProvider({
  experimentId,
  children,
}: React.PropsWithChildren<{ experimentId: string }>) {
  const value = {
    useExperiment: useExperimentHook.bind(undefined, experimentId),
    useUpdateExperiment: useUpdateExperimentHook.bind(undefined, experimentId),
  };
  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
}

export const useExperimentContext = () => useContext(ExperimentContext);
