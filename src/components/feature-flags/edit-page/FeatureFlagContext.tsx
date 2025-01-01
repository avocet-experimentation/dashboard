import { createContext, ReactNode, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FEATURE_FLAG, gqlRequest } from '#/lib/graphql-queries';

export const useFlagQuery = (flagId: string) =>
  useQuery({
    queryKey: ['featureFlag', flagId],
    queryFn: async () => gqlRequest(FEATURE_FLAG, { id: flagId }),
  });

/**
 * Provides access to a given feature flag and helper functions
 */
const FeatureFlagContext = createContext({});

export function FeatureFlagProvider({
  flagId,
  children,
}: {
  flagId: string;
  children: ReactNode;
}) {
  return (
    <FeatureFlagContext.Provider value={{ flagId, useFlagQuery }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFlagContext = () => useContext(FeatureFlagContext);
