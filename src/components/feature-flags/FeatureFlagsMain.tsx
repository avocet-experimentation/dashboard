import { Flex, Heading, Text } from '@chakra-ui/react';
import FeatureFlagCreationModal from './creation-form/FeatureFlagCreationModal';
import FeatureFlagTable from './table/FeatureFlagTable';

export default function FeatureFlagsMain() {
  return (
    <Flex direction="column" padding="25px" height="100vh" overflowY="scroll">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Feature Flags</Heading>
        <FeatureFlagCreationModal />
      </Flex>
      <Text margin="15px 0">
        Select a flag to view details and make changes.
      </Text>
      <FeatureFlagTable />
    </Flex>
  );
}
