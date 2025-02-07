import { Flex, Heading, Text } from '@chakra-ui/react';
import SDKConnectionTable from './table/SDKConnectionTable';
import SDKConnectionManagementModal from './management-form/SDKConnectionManagementModal';

/**
 * Parent component for Connections
 */
export default function SDKConnectionsMain() {
  return (
    <Flex direction="column" padding="25px" height="100vh" overflowY="scroll">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">SDK Connections</Heading>
        <SDKConnectionManagementModal />
      </Flex>
      <Text margin="15px 0"></Text>
      <SDKConnectionTable />
    </Flex>
  );
}
