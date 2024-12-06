import { Stack, Flex, Text } from "@chakra-ui/react";
import { ForcedValue } from "@estuary/types";

export default function ForcedValueStub({ rule }: { rule: ForcedValue }) {
  return (<>
    <Stack gap={4} key={rule.id}>
      <Text>Forced Value</Text>
      <Flex width="100%" alignContent="center">
        <Text fontWeight="bold" width="fit-content">
          SERVE
        </Text>
        <Text
          fontWeight="normal"
          fontFamily="'Lucida Console', 'Courier New', monospace"
          padding="0 15px"
        >
          {String(rule.value)}
        </Text>
      </Flex>
    </Stack>
  </>)
}