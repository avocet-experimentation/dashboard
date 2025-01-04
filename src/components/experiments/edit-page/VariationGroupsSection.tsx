import { Experiment } from '@avocet/core';
import { Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import GroupPieChart from './GroupPieChart';
import GroupTabsView from './GroupTabsView';
import GroupsControl from './GroupsControl';
export default function VariationGroupsSection({
  experiment,
}: {
  experiment: Experiment;
}) {
  return (
    <Stack padding="15px" bg="avocet-section" borderRadius="5px" gap={4}>
      <Heading size="lg">User Groups ({experiment.groups.length})</Heading>
      <Grid templateColumns="1fr 2fr" gap={6}>
        <GridItem>
          <Grid templateRows="1fr 1fr" height="fit-content">
            <GridItem>
              <GroupPieChart />
            </GridItem>
            <GridItem>
              <GroupsControl />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem>
          <GroupTabsView />
        </GridItem>
      </Grid>
    </Stack>
  );
}
