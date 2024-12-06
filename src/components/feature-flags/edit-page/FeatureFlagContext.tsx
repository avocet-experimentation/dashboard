import { Environment, FeatureFlag, FeatureFlagDraft } from '@estuary/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ServicesContext } from '#/services/ServiceContext';

/**
 * Provides access to a given feature flag and helper functions
 */
export const FeatureFlagContext = createContext({});

export function FeatureFlagProvider({
  flagId,
  children,
}: {
  flagId: string;
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [featureFlag, setFeatureFlag] = useState<FeatureFlag>();
  const [environments, setEnvironments] = useState<Environment[]>();
  const services = useContext(ServicesContext);

  const handleFlagUpdate = async (
    updates: Partial<FeatureFlagDraft>,
  ): Promise<boolean> => {
    const flagResponse = await services.featureFlag.updateFeature(
      flagId,
      updates,
    );

    return flagResponse.ok;
  };

  const getFeatureFlag = async () => {
    setIsLoading(true);
    try {
      const flagResponse = await services.featureFlag.getFeature(flagId);
      if (!flagResponse.ok) {
        // todo: better error handling
        throw new Error(`Couldn't fetch flag data for id ${flagId}!`);
      }

      const envResponse = await services.environment.getMany();
      // todo: better error handling
      if (!envResponse.ok) throw new Error("Couldn't load environments!");

      setFeatureFlag(flagResponse.body);
      setEnvironments(envResponse.body);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {});
  return (
    <FeatureFlagContext.Provider
      value={{ featureFlag, environments, handleFlagUpdate, getFeatureFlag }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
}
