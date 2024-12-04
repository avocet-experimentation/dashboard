import { Flex, Heading, Text } from '@chakra-ui/react';
import { Environment } from '@estuary/types';
import { useEffect, useState } from 'react';
import EnvironmentService from '#/services/EnvironmentService';
import EnvironmentTable from './EnvironmentTable';
import EnvironmentManagementModal from './EnvironmentManagementModal';

// const CREATE_ENVIRONMENT_FORM_ID = 'create-environment-form';

/**
 * Parent component for Environments
 */
export default function EnvironmentsMainPage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [modalVisible, setModalVisible] = useState(false);
  const environmentService = new EnvironmentService();

  const getAllEnvironments = async () => {
    try {
      const response = await environmentService.getEnvironments();
      const allEnvironments = response.body ?? [];
      setEnvironments(allEnvironments);
    } catch (error) {
      console.log(error);
    }
  };

  const updateEnvironment = (obj: Environment) => {
    setEnvironments((prevState) => {
      const environmentIndex = prevState.find((el) => el.id === obj.id);
      if (environmentIndex) {
        return prevState.map((el) => (el.id === obj.id ? obj : el));
      } else {
        return [...prevState, obj];
      }
    });
  };

  useEffect(() => {
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
          setEnvironments={setEnvironments}
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
          setEnvironments={setEnvironments}
          updateEnvironment={updateEnvironment}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        'No environments found. Please create one.'
      )}
    </Flex>
  );
}
