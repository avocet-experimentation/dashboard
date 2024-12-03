import { useEffect, useState } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { CirclePlus } from 'lucide-react';
import ExperimentCreationForm from './ExperimentForm';
import FormModalTrigger from '../FormModal';
import { Experiment } from '@estuary/types';
import ExperimentTable from './ExperimentTable';
import ExperimentService from '#/services/ExperimentService';

const CREATE_EXPERIMENT_FORM_ID = 'experiment-management-form';

const experimentService = new ExperimentService();

const Experiments = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    const handleGetAllExperiments = async () => {
      try {
        const allExperiments = await experimentService.getAllExperiments();
        setExperiments(allExperiments.ok ? await allExperiments.body : []);
        console.log(experiments);
      } catch (error) {
        console.log(error);
      }
    };

    return () => handleGetAllExperiments();
  }, []);

  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Experiments</Heading>
        <FormModalTrigger
          triggerButtonIcon={<CirclePlus />}
          triggerButtonText={'Create Experiment'}
          title={'Create a New Experiment'}
          formId={CREATE_EXPERIMENT_FORM_ID}
          confirmButtonText={'Create'}
        >
          <ExperimentCreationForm
            formId={CREATE_EXPERIMENT_FORM_ID}
            setIsLoading={undefined}
          />
        </FormModalTrigger>
      </Flex>
      <Text margin="15px 0">
        Experiments are useful for tracking and assessing feature performance.
      </Text>
      {experiments.length ? (
        <ExperimentTable experiments={experiments} />
      ) : (
        'No experiments found. Please create one.'
      )}
    </Flex>
  );
};

export default Experiments;
