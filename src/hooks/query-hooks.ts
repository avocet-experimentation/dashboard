import { CreateExperimentMutation, Experiment } from '#/graphql/graphql';
import {
  ALL_FEATURE_FLAGS,
  CREATE_EXPERIMENT,
  FEATURE_FLAG,
  gqlRequest,
} from '#/lib/graphql-queries';
import TelemetryService from '#/services/TelemetryService';
import { ExperimentDraft, FeatureFlag } from '@avocet/core';
import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

export const useAllFeatureFlags = () =>
  useQuery({
    queryKey: ['allFeatureFlags'],
    queryFn: async () => gqlRequest(ALL_FEATURE_FLAGS, {}),
    placeholderData: { allFeatureFlags: [] } as {
      allFeatureFlags: FeatureFlag[];
    },
  });

export const useFeatureFlag = (flagId: string) =>
  useQuery({
    queryKey: ['featureFlag', flagId],
    queryFn: async () => gqlRequest(FEATURE_FLAG, { id: flagId }),
  });

export const useAllTelemetry = () => {
  const telemetryService = new TelemetryService();
  return useQuery({
    queryKey: ['allTelemetry'],
    queryFn: async () => {
      const response = await telemetryService.getMany();
      if (!response.ok) return [];
      return response.body;
    },
  });
};

export const useCreateExperiment = (
  options?: Omit<
    UseMutationOptions<CreateExperimentMutation, Error, ExperimentDraft>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    ...options,
    mutationKey: ['allExperiments'],
    mutationFn: async (newEntry: ExperimentDraft) =>
      gqlRequest(CREATE_EXPERIMENT, { newEntry }),
  });
