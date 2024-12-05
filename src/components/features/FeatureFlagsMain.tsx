import { Flex, Heading, Text } from '@chakra-ui/react';
import { CirclePlus } from 'lucide-react';
import FeatureService from '#/services/FeatureService';
import { FeatureFlag } from '@estuary/types';
import { useEffect, useState } from 'react';
import FormModalTrigger from '../FormModal';
import FeatureCreationForm from './FeatureForm';
import FeatureTable from './FeatureTable';

const CREATE_FEATURE_FORM_ID = 'create-feature-form';

const featureService = new FeatureService();

function Features() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  }, []);

  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Features</Heading>
        <FormModalTrigger
          triggerButtonIcon={<CirclePlus />}
          triggerButtonText="Add Feature"
          title="Create a New Feature"
          formId={CREATE_FEATURE_FORM_ID}
          confirmButtonText="Create"
        >
          <FeatureCreationForm
            formId={CREATE_FEATURE_FORM_ID}
            setIsLoading={setIsLoading}
          />
        </FormModalTrigger>
      </Flex>
      <Text margin="15px 0">
        Features enable you to change your app's behavior from within this UI.
      </Text>
      {featureFlags.length ? (
        <FeatureTable
          featureFlags={featureFlags}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        'No features found. Please create one.'
      )}
    </Flex>
  );
}

export default Features;
