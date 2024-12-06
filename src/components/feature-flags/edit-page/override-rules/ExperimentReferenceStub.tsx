import { Stack, Flex, Text } from "@chakra-ui/react";
import { ExperimentReference } from "@estuary/types";

export default function ExperimentReferenceStub(
  { rule }: { rule: ExperimentReference }
) {
  /*
    todo:
    - show experiment status and enrollment attributes
  */
  return (<>
    <Stack gap={4} key={rule.id}>
      <Text>Experiment: {rule.name}</Text>
      <Flex width="100%" alignContent="center">
        <Text fontWeight="bold" width="fit-content">
          SERVE
        </Text>
        <Text
          fontWeight="normal"
          fontFamily="'Lucida Console', 'Courier New', monospace"
          padding="0 15px"
        >
          {rule.description ?? ''}
        </Text>
        <Text
          fontWeight="normal"
          fontFamily="'Lucida Console', 'Courier New', monospace"
          padding="0 15px"
        >
          status: {rule.status}
        </Text>
      </Flex>
    </Stack>
  </>)
}