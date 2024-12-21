import { Flex, Heading, Text } from '@chakra-ui/react';
import ExperimentTable from './table/ExperimentTable';
import ExperimentCreationModal from './creation-form/ExperimentCreationModal';
import { ExperimentProvider } from './ExperimentContext';

export default function ExperimentsMain() {
  return (
    <ExperimentProvider>
      <Flex direction="column" padding="25px" height="100vh" overflowY="scroll">
        <Flex
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="3xl">Experiments</Heading>
          <ExperimentCreationModal />
          {/* <ExperimentInitModal
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          /> */}
        </Flex>
        <Text margin="15px 0">
          Experiments are useful for tracking and assessing feature performance.
        </Text>
        <ExperimentTable />
      </Flex>
    </ExperimentProvider>
  );
}
