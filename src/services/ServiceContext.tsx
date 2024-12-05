/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';
import EnvironmentService from '#/services/EnvironmentService';
import FeatureService from '#/services/FeatureService';
import ExperimentService from './ExperimentService';

const services = Object.seal({
  environment: new EnvironmentService(),
  featureFlag: new FeatureService(),
  experiment: new ExperimentService(),
});

export const ServicesContext = createContext(services);

export function ServicesProvider({ children }: React.PropsWithChildren) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}
