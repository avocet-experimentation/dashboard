import { Flex, Heading, Text } from '@chakra-ui/react';
import { Environment, FeatureFlag } from '@estuary/types';
import { useEffect, useState } from 'react';
import FeatureService from '#/services/FeatureService';
import EnvironmentService from '#/services/EnvironmentService';
import FeatureFlagTable from './FeatureFlagTable';
import FeatureFlagCreationModal from './FeatureFlagCreationModal';
import { LoaderWrapper } from '../helpers/LoaderWrapper';

const featureService = new FeatureService();
const environmentService = new EnvironmentService();

const getPinned = (envs: Environment[]) => envs.filter((env) => env.pinToLists);

export default function FeatureFlagsMain() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAllFeatures = async () => {
    const featureResponse = await featureService.getAllFeatures();
    const allFeatures = featureResponse.ok ? featureResponse.body : [];
    setFeatureFlags(allFeatures);
  };

  const getAllEnvironments = async () => {
    const response = await environmentService.getMany();
    setEnvironments(response.body ?? []);
  };

  useEffect(() => {
    setIsLoading(true);

    const loadData = async () => {
      try {
        await Promise.all([getAllFeatures(), getAllEnvironments()]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
          // updateFlag={updateFlag}
          environments={environments}
        />
      </Flex>
      <Text margin="15px 0">
        Features enable you to change your app's behavior from within this UI.
      </Text>
      <LoaderWrapper isLoading={isLoading}>
        {featureFlags.length ? (
          <FeatureFlagTable
            featureFlags={featureFlags}
            updateFlag={updateFlag}
            pinnedEnvironments={getPinned(environments)}
            isLoading={isLoading}
          />
        ) : (
          'No features found. Please create one.'
        )}
      </LoaderWrapper>
    </Flex>
  );
}
