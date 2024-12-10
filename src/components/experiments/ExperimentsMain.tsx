import { useContext, useEffect, useState } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { Experiment } from '@avocet/core';
import { ServicesContext } from '#/services/ServiceContext';
import ExperimentTable from './table/ExperimentTable';
import ExperimentCreationModal from './creation-form/ExperimentCreationModal';
import ExperimentInitModal from './ExperimentInitModal'

// const CREATE_EXPERIMENT_FORM_ID = 'experiment-management-form';

export default function ExperimentsMain() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { experiment: experimentService } = useContext(ServicesContext);

  useEffect(() => {
    const handleGetAllExperiments = async () => {
      try {
        const response = await experimentService.getAllExperiments();
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        setExperiments(response.body);
      } catch (error) {
        console.log(error);
      }
    };

    handleGetAllExperiments();
  }, []);

  return (
    <Flex direction="column" padding="25px" height="100vh" overflowY="scroll">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Experiments</Heading>
        <ExperimentCreationModal setIsLoading={setIsLoading} />
        {/* <ExperimentInitModal
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        /> */}
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
}
