import { ServicesContext } from '#/services/ServiceContext';
import { Environment, environmentSchema, SchemaParseError } from '@avocet/core';
import { createContext, useContext, useEffect, useState } from 'react';

interface IEnvironmentContext {
  environments: Environment[];
}

const EnvironmentContext = createContext<IEnvironmentContext>({
  environments: [],
});

export function EnvironmentProvider({ children }: React.PropsWithChildren) {
  const [environments, setEnvironments] = useState<Environment[]>([]);

  const services = useContext(ServicesContext);

  const fetchEnvironments = async () => {
    const response = await services.environment.getMany();

    if (!response.ok) return;

    const safeParseResult = environmentSchema.array().safeParse(response.body);

    if (!safeParseResult.success) {
      const error = new SchemaParseError(safeParseResult);
      console.error(error);
      return;
    }

    setEnvironments(safeParseResult.data);
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  return (
    <EnvironmentContext.Provider value={{ environments }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export const useEnvironmentContext = () => useContext(EnvironmentContext);
