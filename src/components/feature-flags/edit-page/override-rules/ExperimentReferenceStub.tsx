import { Status } from '#/components/ui/status';
import { Tag } from '#/components/ui/tag';
import { Tooltip } from '#/components/ui/tooltip';
import { Stack, Flex, Text, HStack } from '@chakra-ui/react';
import { ExperimentReference } from '@avocet/core';
import { Link } from 'wouter';

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
        bg="avocet-section"
        border="1px solid"
        borderRadius="5px"
        padding="15px"
      >
        <HStack gap={4}>
          <Tag
            colorPalette="avocet-tag"
            variant="outline"
            size="xl"
            width="fit-content"
            fontWeight="bold"
          >
            Experiment
          </Tag>
          <Link href={`/experiments/${rule.id}`}>
            <Text fontSize="lg">{rule.name}</Text>
          </Link>
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
        <Flex width="100%" alignContent="center"></Flex>
      </Stack>
    </>
  );
}
