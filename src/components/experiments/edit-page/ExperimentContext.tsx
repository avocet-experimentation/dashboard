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
    mutationFn: async (partialEntry: Partial<ExperimentDraft>) =>
      gqlRequest(UPDATE_EXPERIMENT, {
        partialEntry: { ...partialEntry, id: experimentId },
      }),
    ...options,
    mutationKey: ['experiment', experimentId],
  });
};

const ExperimentContext = createContext<{
  experiment: Experiment;
  useUpdateExperiment: (
    options?: Parameters<typeof useUpdateExperimentHook>[1],
  ) => ReturnType<typeof useUpdateExperimentHook>;
} | null>(null);

export function ExperimentProvider({
  experiment,
  children,
}: React.PropsWithChildren<{ experiment: Experiment }>) {
  const value = {
    experiment,
    useUpdateExperiment: useUpdateExperimentHook.bind(undefined, experiment.id),
  };
  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
}

export const useExperimentContext = () => {
  const result = useContext(ExperimentContext);
  if (result === null)
    throw new Error(`Experiment context was accessed outside its provider!`);
  return result;
};
