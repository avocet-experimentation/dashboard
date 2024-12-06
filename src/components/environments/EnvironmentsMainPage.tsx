import { Flex, Heading, Text } from '@chakra-ui/react';
import { Environment } from '@estuary/types';
import { useContext, useEffect, useState } from 'react';
import { ServicesContext } from '#/services/ServiceContext';
import EnvironmentTable from './table/EnvironmentTable';
import EnvironmentManagementModal from './management-form/EnvironmentManagementModal';

/**
 * Parent component for Environments
 */
export default function EnvironmentsMainPage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { environment } = useContext(ServicesContext);

  const updateEnvironment = (obj: Environment) => {
    setEnvironments((prevState) => {
      const environmentIndex = prevState.find((el) => el.id === obj.id);
      if (environmentIndex) {
        return prevState.map((el) => (el.id === obj.id ? obj : el));
      }
      return [...prevState, obj];
    });
  };

  useEffect(() => {
    const getAllEnvironments = async () => {
      try {
        const response = await environment.getMany();
        const allEnvironments = response.body ?? [];
        setEnvironments(allEnvironments);
      } catch (error) {
        console.log(error);
      }
    };

    getAllEnvironments();
  }, []);

  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Environments</Heading>
        <EnvironmentManagementModal
          setIsLoading={setIsLoading}
          updateEnvironment={updateEnvironment}
        />
      </Flex>
      <Text margin="15px 0">
        Defining multiple environments allows for feature flags to behave
        differently in each environment.
      </Text>
      {environments.length ? (
        <EnvironmentTable
          environments={environments}
          updateEnvironment={updateEnvironment}
          setIsLoading={setIsLoading}
        />
      ) : (
        'No environments found. Please create one.'
      )}
    </Flex>
  );
}
