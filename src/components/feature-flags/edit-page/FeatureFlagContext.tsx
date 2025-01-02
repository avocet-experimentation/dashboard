import { createContext, ReactNode, useContext } from 'react';

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
    <FeatureFlagContext.Provider value={{ flagId }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFlagContext = () => useContext(FeatureFlagContext);
