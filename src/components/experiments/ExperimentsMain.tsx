import { Flex, Heading, Text } from '@chakra-ui/react';
import ExperimentTable from './table/ExperimentTable';
import ExperimentCreationModal from './creation-form/ExperimentCreationModal';

export default function ExperimentsMain() {
  return (
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
      <ExperimentTable />
    </Flex>
  );
}
