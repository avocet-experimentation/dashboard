import { ExperimentGroup } from '@avocet/core';
import { Box, Heading, Stack } from '@chakra-ui/react';

export default function TrafficAllocation({
  traffic,
  groups,
}: {
  traffic: number;
  groups: ExperimentGroup[];
}) {
  const getSplits = () => {
    let splits = '';
    groups.forEach((group) => {
      splits += `/${group.proportion}`;
    });
    return splits + 'splits';
  };

  return (
    <Stack padding="15px" bg="white" borderRadius="5px">
      <Heading size="lg">Traffic Allocation</Heading>
      <Stack width="50%">
        <Box>{traffic * 100}% included</Box>
        <Box>{getSplits()}</Box>
      </Stack>
    </Stack>
  );
}
