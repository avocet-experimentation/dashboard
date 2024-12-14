import { Tag } from '#/components/ui/tag';
import { Stack, Flex, Text } from '@chakra-ui/react';
import { ForcedValue } from '@estuary/types';

export default function ForcedValueStub({ rule }: { rule: ForcedValue }) {
  return (
    <>
      <Stack
        gap={4}
        key={rule.id}
        bg="whiteAlpha.700"
        border="1px solid black"
        borderRadius="5px"
        padding="15px"
      >
        <Tag variant="outline" size="xl" width="fit-content" fontWeight="bold">
          Forced Value
        </Tag>
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
    </>
  );
}
