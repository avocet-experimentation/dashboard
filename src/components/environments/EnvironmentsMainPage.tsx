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
      <Text margin="15px 0">
        Defining multiple environments allows for feature flags to behave
        differently in each environment.
      </Text>
      <EnvironmentTable />
    </Flex>
  );
}
