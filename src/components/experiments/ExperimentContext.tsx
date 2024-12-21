import {
  Environment,
  Experiment,
  FeatureFlag,
  FeatureFlagDraft,
} from '@avocet/core';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GQLParsedResponse, ResponseTypes } from '#/lib/fetchTypes';
import { ServicesContext } from '#/services/ServiceContext';

interface ExperimentContextValue {
  isLoading: boolean;
  experiments: Experiment[];
  featureFlags: FeatureFlag[];
  selectedFlags: FeatureFlag[];
  environments: Environment[];
  fetchAndHandle: Function;
  fetchFlags: () => Promise<void>;
  fetchAllExperiments: () => Promise<void>;
  // fetchExperiment: (experimentId: string) => Promise<unknown>;
  fetchEnvironments: () => Promise<void>;
  setSelectedFlags: React.Dispatch<React.SetStateAction<FeatureFlag[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaults = {
  isLoading: false,
  experiments: [],
  featureFlags: [],
  selectedFlags: [],
  environments: [],
  fetchAndHandle: () => {},
  fetchFlags: async () => {},
  fetchAllExperiments: async () => {},
  // fetchExperiment: async () => {},
  fetchEnvironments: async () => {},
  setSelectedFlags: () => {},
  setIsLoading: () => {},
};
/**
 *
 */
export const ExperimentContext =
  createContext<ExperimentContextValue>(defaults);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(defaults.isLoading);
  const [experiments, setExperiments] = useState<Experiment[]>(
    defaults.experiments,
  );
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(
    defaults.featureFlags,
  );
  const [selectedFlags, setSelectedFlags] = useState<FeatureFlag[]>(
    defaults.selectedFlags,
  );
  const [environments, setEnvironments] = useState<Environment[]>(
    defaults.environments,
  );
  const services = useContext(ServicesContext);

  const fetchAndHandle = async <T, R>(
    fetcher: () => Promise<ResponseTypes<T> | GQLParsedResponse<T>>,
    // setState: React.Dispatch<React.SetStateAction<T>>,
    responseBodyHandler: (responseBody: T, ...args: never[]) => R,
  ) => {
    // // prevent overfetching
    // if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetcher();
      if (!response.ok) {
        const errorMessage =
          'errors' in response
            ? response.errors.join('\n')
            : response.statusText;
        throw new Error(errorMessage);
      }

      return responseBodyHandler(response.body);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllExperiments = async () =>
    fetchAndHandle(
      services.experiment.getAll.bind(services.experiment),
      setExperiments,
    );

  // const fetchExperiment = async (experimentId: string) =>
  //   fetchAndHandle(
  //     services.experiment.get.bind(services.experiment, experimentId),
  //     (responseBody: Experiment) => responseBody,
  //   );

  const fetchFlags = async () =>
    fetchAndHandle(
      services.featureFlag.getAll.bind(services.featureFlag),
      setFeatureFlags,
    );

  const fetchEnvironments = async () =>
    fetchAndHandle(
      services.environment.getMany.bind(services.environment),
      setEnvironments,
    );

  useEffect(() => {
    setIsLoading(true);
    fetchAllExperiments().finally(() => setIsLoading(false));
  }, []);

  const value = {
    fetchAndHandle,
    experiments,
    fetchAllExperiments,
    // fetchExperiment,
    featureFlags,
    fetchFlags,
    environments,
    fetchEnvironments,
    selectedFlags,
    setSelectedFlags,
    isLoading,
    setIsLoading,
  };

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
}
