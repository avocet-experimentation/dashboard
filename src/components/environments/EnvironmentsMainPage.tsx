import { Flex, Heading, Text } from '@chakra-ui/react';
import EnvironmentTable from './table/EnvironmentTable';
import EnvironmentManagementModal from './management-form/EnvironmentManagementModal';

/**
 * Parent component for Environments
 */
export default function EnvironmentsMainPage() {
  return (
    <Flex direction="column" padding="25px" height="100vh" overflowY="scroll">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Environments</Heading>
        <EnvironmentManagementModal />
      </Flex>
      <EnvironmentTable />
    </Flex>
  );
}
