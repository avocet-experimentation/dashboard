import { Experiment } from '@avocet/core';
import { Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import GroupPieChart from './GroupPieChart';
import GroupTabsView from './GroupTabsView';
export default function VariationGroupsSection({
  experiment,
}: {
  experiment: Experiment;
}) {
  return (
    <Stack padding="15px" bg="avocet-section" borderRadius="5px">
      <Heading size="lg">User Groups ({experiment.groups.length})</Heading>
      <Grid templateColumns="1fr 2fr" gap={6}>
        <GridItem>
          {/* <Grid templateRows="1fr 1fr">
            <GridItem> */}
          <GroupPieChart experiment={experiment} />
          {/* </GridItem>
            <GridItem>test</GridItem>
          </Grid> */}
        </GridItem>
        <GridItem>
          <GroupTabsView experiment={experiment} />
        </GridItem>
      </Grid>
    </Stack>
  );
}
