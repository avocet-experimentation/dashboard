import {
  ALL_FEATURE_FLAGS,
  FEATURE_FLAG,
  gqlRequest,
} from '#/lib/graphql-queries';
import TelemetryService from '#/services/TelemetryService';
import { FeatureFlag } from '@avocet/core';
import { useQuery } from '@tanstack/react-query';

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
