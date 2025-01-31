import { Flex, Heading } from '@chakra-ui/react';
import ExperimentTable from './table/ExperimentTable';
import ExperimentCreationModal from './creation-form/ExperimentCreationModal';
import ExperimentInitModal from './ExperimentInitModal';

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
        {/* <ExperimentCreationModal /> */}
        <ExperimentInitModal />
      </Flex>
      <ExperimentTable />
    </Flex>
  );
}
