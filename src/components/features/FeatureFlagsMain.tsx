import { Flex, Heading, Text } from '@chakra-ui/react';
import { Environment, FeatureFlag } from '@estuary/types';
import { useEffect, useState } from 'react';
import FeatureService from '#/services/FeatureService';
import EnvironmentService from '#/services/EnvironmentService';
import FeatureFlagTable from './FeatureFlagTable';
import FeatureFlagCreationModal from './FeatureFlagCreationModal';

const featureService = new FeatureService();
const environmentService = new EnvironmentService();

const getPinned = (envs: Environment[]) => envs.filter((env) => env.pinToLists);

export default function FeatureFlagsMain() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAllEnvironments = async () => {
    try {
      const response = await environmentService.getMany();
      const allEnvironments = response.body ?? [];
      setEnvironments(allEnvironments);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleGetAllFeatures = async () => {
      try {
        const featureResponse = await featureService.getAllFeatures();
        const allFeatures = featureResponse.ok ? featureResponse.body : [];
        setFeatureFlags(allFeatures);
      } catch (error) {
        console.log(error);
      }
    };

    handleGetAllFeatures();
    getAllEnvironments();
  }, []);

  const updateFlag = (obj: FeatureFlag) => {
    setFeatureFlags((prevState) => {
      const index = prevState.find((el) => el.id === obj.id);
      if (index) {
        return prevState.map((el) => (el.id === obj.id ? obj : el));
      }
      throw new Error(`Flag ${obj.name} with id ${obj.id} was not found`);
      // return [...prevState, obj];
    });
  };

  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Features</Heading>
        <FeatureFlagCreationModal
          setIsLoading={setIsLoading}
          updateFlag={updateFlag}
          environments={environments}
        />
      </Flex>
      <Text margin="15px 0">
        Features enable you to change your app's behavior from within this UI.
      </Text>
      {featureFlags.length ? (
        <FeatureFlagTable
          featureFlags={featureFlags}
          updateFlag={updateFlag}
          pinnedEnvironments={getPinned(environments)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        'No features found. Please create one.'
      )}
    </Flex>
  );
}
