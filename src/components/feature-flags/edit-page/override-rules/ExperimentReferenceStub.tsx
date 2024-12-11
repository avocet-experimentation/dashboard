import { Status } from '#/components/ui/status';
import { Tag } from '#/components/ui/tag';
import { Tooltip } from '#/components/ui/tooltip';
import { Stack, Flex, Text, HStack } from '@chakra-ui/react';
import { ExperimentReference } from '@estuary/types';

// todo: add to constants.ts file after merge
const statusLegend = {
  draft: {
    color: 'yellow',
    description: 'This experiment is still being configured.',
  },
  active: { color: 'green', description: 'This experiment is in progress.' },
  paused: {
    color: 'red',
    description: 'This experiment is currently not running.',
  },
  completed: {
    color: 'blue',
    description: 'This experiment has reached its end.',
  },
};

export default function ExperimentReferenceStub({
  rule,
}: {
  rule: ExperimentReference;
}) {
  /*
    todo:
    - show experiment status and enrollment attributes
  */
  return (
    <>
      <Stack
        gap={4}
        key={rule.id}
        border="1px solid black"
        borderRadius="5px"
        padding="15px"
      >
        <HStack gap={4}>
          <Tag
            variant="outline"
            size="xl"
            width="fit-content"
            fontWeight="bold"
          >
            Environment
          </Tag>
          <Text fontSize="lg">{rule.name}</Text>
          <Tooltip
            showArrow
            openDelay={50}
            content={statusLegend[rule.status].description}
          >
            <Status colorPalette={statusLegend[rule.status].color}>
              {rule.status}
            </Status>
          </Tooltip>
        </HStack>
        <Flex width="100%" alignContent="center">
          <Text fontWeight="bold" width="fit-content">
            SERVE
          </Text>
          <Text
            fontWeight="normal"
            fontFamily="'Lucida Console', 'Courier New', monospace"
            padding="0 15px"
          >
            {rule.type ?? ''}
          </Text>
        </Flex>
      </Stack>
    </>
  );
}
